import express from 'express';
import { auth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { driverId, startDate, endDate, route, requirements } = req.body;
    
    // Verify driver exists and is available
    const driver = await Driver.findById(driverId);
    if (!driver || !driver.availability) {
      return res.status(400).json({ message: 'Driver not available' });
    }

    const booking = new Booking({
      driverId,
      clientId: req.userId,
      startDate,
      endDate,
      route,
      requirements
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let bookings;

    if (user.type === 'client') {
      bookings = await Booking.find({ clientId: req.userId })
        .populate('driverId', 'userId photo')
        .populate('clientId', 'name email');
    } else {
      const driver = await Driver.findOne({ userId: req.userId });
      bookings = await Booking.find({ driverId: driver._id })
        .populate('driverId', 'userId photo')
        .populate('clientId', 'name email');
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;