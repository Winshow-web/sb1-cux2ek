import express from 'express';
import { body, validationResult } from 'express-validator';
import {supabase} from "../../supabase/index.js";

const router = express.Router();
const HOSTNAME = process.env.HOSTNAME || "localhost";

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.code === "email_not_confirmed") {
                    return res.status(200).json({ message:"Email not verified", verified: false });
                }
                return res.status(401).json({ error:"Invalid login credentials" });
            }

            const user = data?.user;
            const session = data?.session;

            if (!user) {
                console.error('user not found in authentication response');
                return res.status(500).json({ error: 'Authentication failed: No user found' });
            }

            if (!user.email_confirmed_at) {
                return res.status(403).json({
                    error: 'Email not confirmed. Please verify your email first.',
                    details: 'You need to confirm your email address before logging in.',
                });
            }

            const { id: userId, email: userEmail, phone, user_metadata } = user;
            const accountType = user_metadata?.account_type;
            const displayName = user_metadata?.display_name;

            if (!accountType) {
                console.error('Account type missing in user metadata');
                return res.status(404).json({ error: 'Account type not found in user metadata' });
            }

            return res.status(200).json({
                message: 'user logged in successfully',
                user: {
                    id: userId,
                    name: displayName,
                    phone,
                    email: userEmail,
                    account_type: accountType,
                },
                session: {
                    access_token: session.access_token,
                    expires_in: session.expires_in,
                },
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
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('account_type').isIn(['client_new', 'driver_new']).withMessage('Account type must be client_new or driver_new'),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, password, account_type } = req.body;

        try {
            console.log(`Registering user - Name: ${name}, Email: ${email}, Phone: ${phone}, Account Type: ${account_type}`);

            const { data, error } = await supabase.auth.signUp({
                email,
                phone,
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
                console.error('user not returned in registration response');
                return res.status(500).json({ error: 'Registration failed: No user found' });
            }

            console.log('user registered successfully with ID:', user.id);

            return res.status(201).json({
                message: 'user registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    account_type: account_type,
                    name,
                },
            });
        } catch (err) {
            console.error('Error during registration:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/resend-email-verification',
    [
        body('email').isEmail().withMessage('Email is invalid'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `http://${HOSTNAME}/signup/email=${email}`
                },
            });

            if (error) {
                console.error('Error resending email verification:', error.message);
                return res.status(400).json({ error: 'Error resending verification email' });
            }

            return res.status(200).json({
                message: 'Verification email resent successfully. Please check your inbox.',
            });
        } catch (err) {
            console.error('Error during resend email verification:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
);

/*router.post(
    '/email-verified',
    [
        body('email').isEmail().withMessage('Email is invalid'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const { data, error } = await supabase.rpc('check_email_verification', { email });

            if (error) {
                console.error('Error calling RPC:', error.message);
                return res.status(500).json({ error: 'Error checking email verification status' });
            }

            if (data === 'email_does_not_exist') {
                return res.status(404).json({
                    status: 'error',
                    code: 'EMAIL_NOT_FOUND',
                    message: 'Email does not exist',
                });
            }

            if (data === 'email_not_verified') {
                const { error: resendError } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                    options: {
                        emailRedirectTo: `http://${HOSTNAME}/signup/email=${email}`,
                    },
                });

                if (resendError) {
                    console.error('Error resending email verification:', resendError.message);
                    return res.status(400).json({
                        status: 'error',
                        code: 'RESEND_FAILED',
                        message: 'Error resending verification email',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    code: 'EMAIL_NOT_VERIFIED',
                    message: 'Verification email resent successfully. Please check your inbox.',
                });
            }

            if (data === 'email_verified') {
                return res.status(200).json({
                    status: 'success',
                    code: 'EMAIL_VERIFIED',
                    message: 'Email is already verified.',
                });
            }

            // Fallback if something unexpected happens
            return res.status(500).json({
                status: 'error',
                code: 'UNKNOWN_ERROR',
                message: 'Unexpected error occurred',
            });

        } catch (err) {
            console.error('Error during email verification check:', err.message);
            return res.status(500).json({
                status: 'error',
                code: 'INTERNAL_ERROR',
                message: 'Internal server error',
            });
        }
    }
);*/


export default router;
