import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import userRouter from './modules/user/user.router';
import authRouter from './modules/auth/auth.router';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

app.use('/api', userRouter);
app.use('/api/auth', authRouter);

class SocketManager {
    private rooms: Set < string > = new Set(['main-room']);
    private userSockets: Map < string, Socket > = new Map();

    constructor(private io: Server) {
        this.io = io;
        this.initialize();
    }

    private initialize() {
        this.io.on('connection', (socket) => {
            console.log('A user connected');

            socket.emit('updateRoomList', Array.from(this.rooms));

            socket.on('registerUser', (username) => {
                this.userSockets.set(username, socket);
                console.log(`User ${username} registered with socket ${socket.id}`);
            });

            socket.on('createRoom', (roomName) => {
                this.rooms.add(roomName);
                this.io.emit('updateRoomList', Array.from(this.rooms));
            });

            socket.on('joinRoom', (roomName) => {
                socket.join(roomName);
                socket.emit('roomJoined', roomName);
                console.log(`User ${socket.id} joined room ${roomName}`);
            });

            socket.on('leaveRoom', (roomName) => {
                socket.leave(roomName);
                socket.emit('roomLeft');
                console.log(`User ${socket.id} left room ${roomName}`);
            });

            socket.on('inviteUser', ({ usernameToInvite, roomName }) => {
                const invitedSocket = this.userSockets.get(usernameToInvite);
                if (invitedSocket) {
                    const fromUser = [...this.userSockets.entries()].find(([, s]) => s === socket)?.[0];
                    if (fromUser) {
                        invitedSocket.emit('invite', {
                            fromUser,
                            roomName
                        });
                        console.log(`User ${fromUser} invited ${usernameToInvite} to ${roomName}`);
                    } else {
                        socket.emit('inviteError', 'Could not identify the sender');
                    }
                } else {
                    socket.emit('inviteError', 'User not found or not online');
                }
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
                // Remove user from userSockets on disconnect
                for (const [username, s] of this.userSockets.entries()) {
                    if (s === socket) {
                        this.userSockets.delete(username);
                        console.log(`User ${username} unregistered`);
                        break;
                    }
                }
            });
        });
    }
}

new SocketManager(io);

export default server; // Export the server for index.ts to use
