
import {
    createUser,
    createJamSession,
    addNoteEvent,
    getLatestRecording,
    startRecording,
    stopRecording,
    isRoomRecording,
    deleteUser,
} from '../src/modules/session/session.service';

// --- Mock Database and Prisma ---
// In a real test suite, you would use a mocking library like Jest
// to mock the Prisma client. For this demo, we'll just log the actions.

console.log('--- Running Demo Test ---');

const runTest = async () => {
    const roomName = 'test-room';
    const userId = 'test-user-123';

    // 1. Create a user
    console.log(`Creating user: ${userId}`);
    await createUser(userId, 'test-user');

    // 2. Create a jam session and start recording
    console.log(`Creating jam session for room: ${roomName}`);
    const jamSession = await createJamSession(roomName);
    startRecording(roomName, jamSession.id);
    console.log(`Is room recording? ${isRoomRecording(roomName)}`);

    // 3. Add a note event
    console.log('Adding a "noteOn" event...');
    await addNoteEvent(roomName, { type: 'noteOn', data: { note: 'C4' }, time: Date.now() });

    // 4. Stop recording
    console.log('Stopping recording...');
    stopRecording(roomName);
    console.log(`Is room recording? ${isRoomRecording(roomName)}`);

    // 5. Retrieve the recording
    console.log('Fetching latest recording...');
    const recording = await getLatestRecording(roomName);
    console.log('Retrieved recording:', recording?.events);

    // 6. Clean up the user
    console.log(`Deleting user: ${userId}`);
    await deleteUser(userId);

    console.log('--- Demo Test Finished ---');
};

runTest().catch(console.error);
