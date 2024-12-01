import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../db/index.js';
import verifyToken from "../middleware/auth.js";

const router = express.Router();

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

        //console.log(session);

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
              account_type,
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








/*import express from 'express';
import { body, validationResult } from 'express-validator';  
import jwt from 'jsonwebtoken';  
import User from '../models/User.js';  
import Driver from '../models/Driver.js';  
import bcrypt from 'bcryptjs';

const router = express.Router();  

router.get('/', (req, res) => {
  res.json({ message: 'Auth endpoint is working' });
});

// Register  
router.post('/register',  
  [  
    body('name').trim().notEmpty(),  
    body('email').isEmail(),  
    body('password').isLength({ min: 6 }),  
    body('type').isIn(['driver', 'client'])  
  ],  
  async (req, res) => {
    try {  
      const errors = validationResult(req);  
      if (!errors.isEmpty()) {  
        return res.status(400).json({ errors: errors.array() });  
      }  

      const { name, email, password, type } = req.body;  

      // Check if user exists  
      const existingUser = await User.findByEmail(email);  
      if (existingUser) {  
        return res.status(400).json({ message: 'User already exists' });  
      }  

      // Hash password before storing  
      const hashedPassword = await bcrypt.hash(password, 10);  

      // Create user  
      const user = await User.create({ name, email, password: hashedPassword, type });  

      // If registering as driver, create driver profile  
      if (type === 'driver') {  
        await Driver.create({  
          userId: user.id,  
          experience: 0,  
          licenseType: 'Commercial Driver License (CDL) - Class A',  
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',  
          specializations: ['City Tours'],  
          phone: '+1 (555) 123-4567',  
          serviceArea: 'Metropolitan Area'  
        });  
      }  

      // Generate token  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });  

      res.status(201).json({ token, user });  
    } catch (error) {  
      console.error('Registration error:', error);  
      res.status(500).json({ message: 'Server error' });  
    }  
  }  
);  

// Login  
router.post('/login',  
  [  
    body('email').isEmail(),  
    body('password').exists()  
  ],  
  async (req, res) => {  
    try {  
      const errors = validationResult(req);  
      if (!errors.isEmpty()) {  
        return res.status(400).json({ errors: errors.array() });  
      }  

      const { email, password } = req.body;  

      // Find user  
      const user = await User.findByEmail(email);  
      if (!user) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
      }  

      // Check password  
      const isMatch = await bcrypt.compare(password, user.password);  
      if (!isMatch) {  
        return res.status(400).json({ message: 'Invalid credentials' });  
      }  

      // Generate token  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });  

      // Remove password from response  
      delete user.password;  

      res.json({ token, user });  
    } catch (error) {  
      console.error('Login error:', error);  
      res.status(500).json({ message: 'Server error' });  
    }  
  }  
);  

export default router;*/