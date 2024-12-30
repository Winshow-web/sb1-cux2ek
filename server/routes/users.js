import express from 'express';
import { auth } from '../middleware/auth.js'; // Assuming this is your auth middleware
import { supabase } from "../db/index.js"; // Import supabase client

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Fetch the user profile using the user ID from the authenticated request
    const { data, error } = await supabase
        .from('users') // Assuming your table is called 'users'
        .select('*')
        .eq('id', req.userId) // 'req.userId' should be set by the auth middleware
        .single(); // We expect a single result since we're looking for a specific user

    if (error || !data) {
      return res.status(404).json({ message: 'user not found' });
    }

    // Return user data
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password updates through this route

    // Update the user's profile in the Supabase database
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.userId)
        .select(); // Fetch updated data after update

    if (error || !data || data.length === 0) {
      return res.status(404).json({ message: 'user not found or update failed', error });
    }

    // Return the updated user data
    res.json(data[0]); // Return the updated user
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
