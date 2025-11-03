
import { prisma } from '../../db';

// A simple in-memory store for the recording state of each room
const roomRecordingState = new Map<string, { isRecording: boolean; jamSessionId: string | null }>();

// --- User Service Functions ---

export const createUser = (id: string, username: string) => {
  return prisma.user.create({ data: { id, username } });
};

export const deleteUser = (id: string) => {
  return prisma.user.delete({ where: { id } });
};

// --- Jam Session Service Functions ---

export const createJamSession = async (roomName: string) => {
    const newJamSession = await prisma.jamSession.create({
        data: {
            name: roomName,
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
        await prisma.jamSession.update({
            where: { id: state.jamSessionId },
            data: {
                events: {
                    push: event,
                },
            },
        });
    }
};

// --- Room State Functions ---

export const startRecording = (roomName: string, jamSessionId: string) => {
    roomRecordingState.set(roomName, { isRecording: true, jamSessionId });
};

export const stopRecording = (roomName: string) => {
    const state = roomRecordingState.get(roomName);
    if (state) {
        roomRecordingState.set(roomName, { ...state, isRecording: false });
    }
};

export const isRoomRecording = (roomName: string): boolean => {
    return roomRecordingState.get(roomName)?.isRecording || false;
};
