
import { Server, Socket } from 'socket.io';
import {
  createJamSession,
  addNoteEvent,
  startRecording,
  stopRecording,
  isRoomRecording
} from './session.service';

export function registerSessionHandlers(io: Server, socket: Socket) {

    const joinRoom = (roomName: string) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);
        // Create a user record when they join a room
    };

    const leaveRoom = (roomName: string) => {
        socket.leave(roomName);
        console.log(`User ${socket.id} left room ${roomName}`);
    };

    const handleNoteOn = async (data: { room: string, note: any, instrument: any }) => {
        const { room: roomName } = data;
        if (isRoomRecording(roomName)) {
            await addNoteEvent(roomName, { type: 'noteOn', data, time: Date.now() });
        }
        socket.to(roomName).emit('noteOn', data);
    };

    const handleNoteOff = async (data: { room: string, note: any, instrument: any }) => {
        const { room: roomName } = data;
        if (isRoomRecording(roomName)) {
            await addNoteEvent(roomName, { type: 'noteOff', data, time: Date.now() });
        }
        socket.to(roomName).emit('noteOff', data);
    };

    const handleStartRecording = async (roomName: string, id: string) => {
        if (isRoomRecording(roomName)) {
            console.log(`Room ${roomName} is already recording.`);
            return;
        }
        
        console.log(`Started recording in room ${roomName}`);
        const newJamSession = await createJamSession(roomName, id);
        startRecording(roomName, newJamSession.id);
        
        io.to(roomName).emit('recordingStarted');
    };

    const handleStopRecording = (roomName: string) => {
        console.log(`Stopped recording in room ${roomName}`);
        stopRecording(roomName);
        io.to(roomName).emit('recordingStopped');
    };

    const handleDisconnect = () => {
        console.log(`User ${socket.id} disconnected`);
        // Clean up user from the database
        // deleteUser(socket.id).catch(err => {
        //     console.log(`Could not find user ${socket.id} to delete. They might have been a listener without joining a room.`);
        // });
    };

    // Register all event listeners for the socket
    socket.on('joinRoom', joinRoom);
    socket.on('leaveRoom', leaveRoom);
    socket.on('noteOn', handleNoteOn);
    socket.on('noteOff', handleNoteOff);
    socket.on('startRecording', handleStartRecording);
    socket.on('stopRecording', handleStopRecording);
    socket.on('disconnect', handleDisconnect);
}
