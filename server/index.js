import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import crypto from 'crypto'; // For generating nonce
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Route imports
import authRouter from './routes/auth.js';
import userRoutes from './routes/users.js';
import driverRoutes from './routes/drivers.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Create the HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
  const nonce = crypto.randomBytes(16).toString('base64'); // Generate nonce
  res.locals.nonce = nonce; // Store nonce in response locals
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
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Routes (defined after middleware and socket setup)
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Root route for redirect or serving index.html (you could also remove it if it's blocking)
//app.get('/', (req, res) => {
//  const indexPath = path.join(__dirname, 'build', 'index.html');
//  res.sendFile(indexPath, (err) => {
//    if (err) {
//      console.error("Error sending file:", err);
//      res.status(500).send('Error serving index.html');
//    }
//  });
//});

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
