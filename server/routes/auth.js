import express from 'express';  
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

export default router;