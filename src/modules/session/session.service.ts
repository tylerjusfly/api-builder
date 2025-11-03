
import { prisma } from '../../db';

// A simple in-memory store for the recording state of each room
const roomRecordingState = new Map<string, { isRecording: boolean; jamSessionId: string | null }>();


// --- Jam Session Service Functions ---

export const createJamSession = async (roomName: string, roomId: string) => {
    const newJamSession = await prisma.jamSession.create({
        data: {
            name: `jam-session-${roomName}`,
            roomId: roomId,
            events: [], // Initialize with an empty events array
        },
    });
    // Initialize recording state for the room
    roomRecordingState.set(roomName, { isRecording: true, jamSessionId: newJamSession.id });
    return newJamSession;
};

export const getLatestRecording = (roomName: string) => {
  return prisma.jamSession.findFirst({
    where: { name: roomName },
    orderBy: { createdAt: 'desc' },
  });
};

export const addNoteEvent = async (roomName: string, event: { type: 'noteOn' | 'noteOff', data: any, time: number }) => {
    const state = roomRecordingState.get(roomName);
    if (state?.isRecording && state.jamSessionId) {
        // First, get the current session
        const session = await prisma.jamSession.findUnique({
            where: { id: state.jamSessionId },
        });

        if (session) {
            // Annoyingly, Prisma's JSON update isn't a simple push. We have to read, modify, and write.
            const updatedEvents = Array.isArray(session.events) ? [...session.events, event] : [event];

            await prisma.jamSession.update({
                where: { id: state.jamSessionId },
                data: { events: updatedEvents },
            });
        }
    }
};

// --- Room State Functions ---

export const startRecording = (roomName: string, jamSessionId: string) => {
    roomRecordingState.set(roomName, { isRecording: true, jamSessionId });
};

export const stopRecording = (roomName: string) => {
    const state = roomRecordingState.get(roomName);
    if (state) {
        // We don't need to do anything here because events are already saved.
        // We just update the in-memory state to stop recording.
        roomRecordingState.set(roomName, { ...state, isRecording: false });
    }
};

export const isRoomRecording = (roomName: string): boolean => {
    return roomRecordingState.get(roomName)?.isRecording || false;
};
