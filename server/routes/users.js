import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import {supabase} from "../db/index.js";

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // No need for .select()
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password updates through this route

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.userId)
        .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({ message: 'User not found or update failed', error });
    }

    res.json(data[0]); // Return updated user
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
