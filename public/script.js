
document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server

    const roomNameInput = document.getElementById('roomName');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const playbackBtn = document.getElementById('playbackBtn');
    const pianoKeys = document.querySelectorAll('.key');
    const statusDiv = document.getElementById('status');

    let currentRoom = roomNameInput.value;
    
    // --- Tone.js Synthesizer ---
    // Create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth().toDestination();

    // --- Event Listeners for UI ---

    joinRoomBtn.addEventListener('click', () => {
        const room = roomNameInput.value.trim();
        if (room) {
            socket.emit('joinRoom', room);
            currentRoom = room;
            statusDiv.textContent = `Joined room: ${room}`;
        }
    });

    startRecordingBtn.addEventListener('click', () => {
        socket.emit('startRecording', currentRoom);
        statusDiv.textContent = 'Recording started...';
    });

    stopRecordingBtn.addEventListener('click', () => {
        socket.emit('stopRecording', currentRoom);
        statusDiv.textContent = 'Recording stopped.';
    });

    playbackBtn.addEventListener('click', async () => {
        statusDiv.textContent = 'Fetching last recording...';
        try {
            const response = await fetch(`/api/recordings/${currentRoom}`);
            if (response.ok) {
                const events = await response.json();
                if (events && events.length > 0) {
                    statusDiv.textContent = 'Playing back recording...';
                    playback(events);
                } else {
                    statusDiv.textContent = 'No recording found for this room.';
                }
            } else {
                statusDiv.textContent = 'Error fetching recording.';
            }
        } catch (error) {
            console.error('Playback error:', error);
            statusDiv.textContent = 'Failed to fetch recording.';
        }
    });

    // --- Piano Key Interaction ---

    pianoKeys.forEach(key => {
        key.addEventListener('mousedown', () => {
            const note = key.getAttribute('data-note');
            
            // Play the sound
            synth.triggerAttack(note);
            
            // Send noteOn event to the server
            socket.emit('noteOn', { room: currentRoom, note, instrument: 'piano' });
            
            // Visually activate the key
            key.classList.add('active');
        });

        key.addEventListener('mouseup', () => {
            const note = key.getAttribute('data-note');
            
            // Stop the sound
            synth.triggerRelease();
            
            // Send noteOff event to the server
            socket.emit('noteOff', { room: currentRoom, note, instrument: 'piano' });
            
            // Deactivate the key visually
            key.classList.remove('active');
        });

        // Also handle leaving the key area while mouse is down
        key.addEventListener('mouseleave', () => {
            if (key.classList.contains('active')) {
                const note = key.getAttribute('data-note');
                
                synth.triggerRelease();
                
                socket.emit('noteOff', { room: currentRoom, note, instrument: 'piano' });
                key.classList.remove('active');
            }
        });
    });

    // --- Socket.IO Event Handlers ---

    socket.on('noteOn', (data) => {
        console.log('Received noteOn:', data);
        
        // Play sound for remote user
        synth.triggerAttack(data.note);
        
        const key = document.querySelector(`.key[data-note="${data.note}"]`);
        if (key) {
            key.classList.add('active');
        }
    });

    socket.on('noteOff', (data) => {
        console.log('Received noteOff:', data);
        
        // Stop sound for remote user
        synth.triggerRelease();
        
        const key = document.querySelector(`.key[data-note="${data.note}"]`);
        if (key) {
            key.classList.remove('active');
        }
    });

    socket.on('recordingStarted', () => {
        statusDiv.textContent = 'Recording is now active in this room.';
    });

    socket.on('recordingStopped', () => {
        statusDiv.textContent = 'Recording has stopped in this room.';
    });

    // --- Playback Function ---

    function playback(events) {
        if (events.length === 0) return;

        const startTime = events[0].time;

        events.forEach(event => {
            const delay = event.time - startTime;
            setTimeout(() => {
                const key = document.querySelector(`.key[data-note="${event.data.note}"]`);
                if (key) {
                    if (event.type === 'noteOn') {
                        // Play sound during playback
                        synth.triggerAttack(event.data.note);
                        key.classList.add('active');
                    } else {
                        // Stop sound during playback
                        synth.triggerRelease();
                        key.classList.remove('active');
                    }
                }
            }, delay);
        });

        // Clear status after playback finishes
        const totalDuration = events[events.length - 1].time - startTime;
        setTimeout(() => {
            statusDiv.textContent = 'Playback finished.';
            // Deactivate all keys
            pianoKeys.forEach(key => key.classList.remove('active'));
        }, totalDuration + 500);
    }
    
    // Join a default room on load
    socket.emit('joinRoom', currentRoom);
    statusDiv.textContent = `Joined room: ${currentRoom}`;
});
