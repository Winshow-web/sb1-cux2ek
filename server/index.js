import express from 'express';  
import { createServer } from 'http';  
import { Server } from 'socket.io';  
import cors from 'cors';  
import dotenv from 'dotenv';  

// Route imports  
import authRoutes from './routes/auth.js';  
import userRoutes from './routes/users.js';  
import driverRoutes from './routes/drivers.js';  
import bookingRoutes from './routes/bookings.js';  
import messageRoutes from './routes/messages.js';  

// Load environment variables  
dotenv.config();  

const app = express();  
const httpServer = createServer(app);  
const io = new Server(httpServer, {  
  cors: {  
    origin: process.env.CLIENT_URL || 'http://localhost:5173',  
    methods: ['GET', 'POST']  
  }  
});  

// Middleware  
app.use(cors());  
app.use(express.json());  

// Socket.IO connection handling  
const connectedUsers = new Map();  

io.on('connection', (socket) => {  
  console.log('User connected:', socket.id);  

  socket.on('register', (userId) => {  
    if (userId) {  
      connectedUsers.set(userId, socket.id);  
      console.log(`User registered with ID: ${userId}`);  
    } else {  
      console.error('Register event received without userId');  
    }  
  });  

  socket.on('private message', ({ to, message }) => {  
    const receiverSocket = connectedUsers.get(to);  
    if (receiverSocket) {  
      io.to(receiverSocket).emit('private message', message);  
    } else {  
      console.error(`User ${to} is not connected`);  
    }  
  });  

  socket.on('disconnect', () => {  
    for (const [userId, socketId] of connectedUsers.entries()) {  
      if (socketId === socket.id) {  
        connectedUsers.delete(userId);  
        console.log(`User disconnected: ${userId}`);  
        break;  
      }  
    }  
  });  
});  

// Routes  
app.use('/api/auth', authRoutes);  
app.use('/api/users', userRoutes);  
app.use('/api/drivers', driverRoutes);  
app.use('/api/bookings', bookingRoutes);  
app.use('/api/messages', messageRoutes);  

// Error handling middleware  
app.use((err, req, res, next) => {  
  console.error(err.stack);  
  res.status(500).json({ message: 'Something went wrong!' });  
});  

// Start server  
const PORT = process.env.PORT || 5000;  
httpServer.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`);  
  console.log(`CORS enabled for origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);  
});