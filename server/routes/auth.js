import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../db/index.js';  // Assuming this is your Supabase client
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Login route
router.post(
    '/login',
    [
      // Validate input fields
      body('email').isEmail().withMessage('Email is invalid'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        // Authenticate user with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const user = data?.user;
        const session = data?.session;

        if (!user) {
          console.error('User not found in authentication response');
          return res.status(500).json({ error: 'Authentication failed: No user found' });
        }

        // Check email confirmation
        if (!user.email_confirmed_at) {
          return res.status(403).json({
            error: 'Email not confirmed. Please verify your email first.',
            details: 'You need to confirm your email address before logging in.',
          });
        }

        // Extract user metadata
        const { id: userId, email: userEmail, user_metadata } = user;
        const accountType = user_metadata?.account_type;
        const displayName = user_metadata?.display_name;

        if (!accountType) {
          console.error('Account type missing in user metadata');
          return res.status(404).json({ error: 'Account type not found in user metadata' });
        }

        console.log('Successfully logged in user:', userId, 'with account type:', accountType);

        // Respond with user details
        return res.status(200).json({
          message: 'User logged in successfully',
          user: {
            id: userId,
            name: displayName,
            email: userEmail,
            account_type: accountType,
          },
          session,
        });
      } catch (err) {
        console.error('Error logging in user:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
);

// Register route
router.post(
    '/register',
    [
      // Input validation
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('name').notEmpty().withMessage('Name is required'),
      body('account_type').isIn(['client_new', 'driver_new']).withMessage('Account type must be client_new or driver_new'),
    ],
    async (req, res) => {
      // Validate inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, account_type } = req.body;

      try {
        // Log request for debugging
        console.log(`Registering user - Name: ${name}, Email: ${email}, Account Type: ${account_type}`);

        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
              account_type,  // Save account type in user metadata
            },
          },
        });

        if (error) {
          console.error('Error during registration:', error.message);
          return res.status(400).json({ error: error.message });
        }

        const { user } = data;

        if (!user) {
          console.error('User not returned in registration response');
          return res.status(500).json({ error: 'Registration failed: No user found' });
        }

        // Log success
        console.log('User registered successfully with ID:', user.id);

        // Respond with user details
        return res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: user.id,
            email: user.email,
            account_type: account_type,
            display_name: name,
          },
        });
      } catch (err) {
        console.error('Error during registration:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
);

export default router;
