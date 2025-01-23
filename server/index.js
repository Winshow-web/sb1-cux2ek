import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from "path";

import apiRouter from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST']
}));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});