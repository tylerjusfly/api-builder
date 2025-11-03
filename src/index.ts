
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSessionHandlers } from './modules/session/session.handlers';
import { sessionRouter } from './modules/session/session.router';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for simplicity
  },
});

// --- Middleware ---

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// --- API Routes ---

// Register the session API routes
app.use('/api', sessionRouter);

// --- Socket.IO Connection Handling ---

// Handle new socket connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  // Register all the session-related event handlers for this socket
  registerSessionHandlers(io, socket);
});

// --- Server Initialization ---

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
