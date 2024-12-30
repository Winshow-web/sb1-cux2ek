import express from 'express';
import { auth } from '../middleware/auth.js';
import Driver from '../models/Driver.js';
import User from '../models/User.js';

const router = express.Router();

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().populate('userId', 'name email');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get driver profile
router.get('/profile', auth, async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId }).populate('userId', 'name email');
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update driver profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const driver = await Driver.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true }
    ).populate('userId', 'name email');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update availability
router.patch('/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;
    const driver = await Driver.findOneAndUpdate(
      { userId: req.userId },
      { availability },
      { new: true }
    );
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;