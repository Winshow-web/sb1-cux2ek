import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { createServer } from 'http';
import { Server } from 'socket.io';

import { supabase } from './db/index.js';

import AccountType from './models/AccountType.js';
import {header} from "express-validator";

// Load environment variables from .env file
dotenv.config();

//const express = require('express');
//const bodyParser = require('body-parser');

// Create an Express app
const app = express();

//app.use(bodyParser.json());

// Create an HTTP server from the Express app
const httpServer = createServer(app);

// Initialize the Socket.IO server with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});


// Middleware

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

// Parse incoming JSON requests
app.use(express.json());



app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          account_type: AccountType.basic
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { user } = data;
    const { id } = user;

    // Log to check if user ID is returned successfully
    console.log('Registered user ID:', id);

    // Respond with success
    res.status(201).json({ message: 'User registered successfully', data });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Authenticate the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const user = data?.user;

    if (!user) {
      console.log('User not found in authentication response');
      return res.status(500).json({ error: 'Authentication failed: No user found' });
    }

    if (!user.email_confirmed_at) {
      return res.status(403).json({
        error: 'Email not confirmed. Please verify your email first.',
        details: 'You need to confirm your email address before logging in.',
      });
    }

    // Extract `account_type` from user_metadata
    const { id: userId, email: userEmail, user_metadata } = user;
    const accountType = user_metadata?.account_type;

    if (!accountType) {
      console.log('Account type missing in user metadata');
      return res.status(404).json({
        error: 'Account type not found in user metadata',
      });
    }

    console.log('Successfully logged in user:', userId, 'with account type:', accountType);

    // Respond with user details
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: userId,
        email: userEmail,
        account_type: accountType,
      },
    });
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/new/driver/', async (req, res) => {
  const { id, phone, experiecne, rating, licenseType, specializations, serviceArea, availability, photo } = req.body;

});

app.get('/get/driver/', async (req, res) => {
  const { driverId } = req.body;

  if (!driverId) {
    return res.status(400).json({ error: 'Driver Id Required' });
  }

  try {
    const { data, error } = await supabase
        .from('Drivers')
        .select('*')
        .eq('id', driverId);

    if (!data) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    return res.json(data);

  } catch (err) {
    console.error('Error Fetching Driver Info:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/get_client', async (req, res) => {

});

app.post('/api/get_booking', async (req, res) => {

});

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Example protected route
app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






/*
// Socket.IO connection handling (after middleware, before routes)

const ConnectedUsers = new Map();
const LoggedInUsers = new Map();

io.on('connection', (socket) => {

  console.log('User connected:', socket.id);
  ConnectedUsers.set(socket.id, { userId: null });


  socket.on('login', (userId) => {
    if (ConnectedUsers.has(userId)) {
      LoggedInUsers.set(userId, socket.id);
      if (ConnectedUsers.has(socket.id)) {ConnectedUsers.delete(socket.id);}
    }
    else if (LoggedInUsers.has(userId)) {

    }
  });

  socket.on('register', (userId, select) => {
    if (ConnectedUsers.has(userId)) {
      if (select === 'basic') {}
      else if (select === 'driver') {}
      else if (select === 'client') {}
    }
  });

  socket.on('message', (userId, select) => {
    if (LoggedInUsers.has(userId)) {
      if (select === 'private') {}
    }
  });

  socket.on('booking', (userId, select) => {
    if (LoggedInUsers.has(userId)) {
      if (select === 'new') {}
      else if (select === 'remove') {}
    }
  });

  //socket.on('', (userId) => {});


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (ConnectedUsers.has(socket.id)) {
      ConnectedUsers.delete(socket.id);
      console.log('User removed from the map');
    }
  });

});
*/



/*

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import crypto from 'crypto'; // For generating nonce
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// Route imports
import authRouter from './routes/auth.js';
import userRoutes from './routes/users.js';
import driverRoutes from './routes/drivers.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Create the HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Ensure CLIENT_URL is set
    methods: ['GET', 'POST']
  }
});

// Middleware

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Middleware to generate a nonce and make it available in response locals
app.use((req, res, next) => {
  // Generate nonce
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Store nonce in response locals

  console.log(`Incoming ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  next();
});

// Configure Content Security Policy (CSP) using helmet
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"], // Allow same-origin content
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`, // Inject nonce dynamically
          process.env.CLIENT_URL
        ], // Allow inline scripts and scripts from your client URL
        connectSrc: ["'self'", process.env.CLIENT_URL], // Allow WebSocket or API requests to the same domain or client URL
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if needed
        imgSrc: ["'self'"], // Allow images from the same origin
        fontSrc: ["'self'"], // Allow fonts from the same origin
      },
    })
);

// Socket.IO connection handling (after middleware, before routes)
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on('private message', ({ to, message }) => {
    const receiverSocket = connectedUsers.get(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit('private message', message);
    }
  });

  socket.on('disconnect', () => {
    // Clean up the user when disconnected
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Routes (defined after middleware and socket setup)
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Fallback route for undefined endpoints (optional, uncomment if needed)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware (should be the last)
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  console.error("Error Details:", err); // Log error details
  res.status(500).json({ message: 'Something went wrong!', error: err.message || err });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

*/
