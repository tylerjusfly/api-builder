document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server

    // Existing elements
    const roomNameInput = document.getElementById('roomName');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const playbackBtn = document.getElementById('playbackBtn');
    const pianoKeys = document.querySelectorAll('.key');
    const statusDiv = document.getElementById('status');

    // Auth elements
    const signupUsernameInput = document.getElementById('signup-username');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupBtn = document.getElementById('signup-btn');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const userInfoDiv = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    // New Room and Invite elements
    const newRoomNameInput = document.getElementById('new-room-name');
    const createRoomBtn = document.getElementById('create-room-btn');
    const roomList = document.getElementById('room-list');
    const currentRoomContainer = document.getElementById('current-room-container');
    const currentRoomNameSpan = document.getElementById('current-room-name');
    const leaveRoomBtn = document.getElementById('leave-room-btn');
    const inviteUsernameInput = document.getElementById('invite-username');
    const inviteBtn = document.getElementById('invite-btn');
    const inviteNotification = document.getElementById('invite-notification');
    const inviteMessage = document.getElementById('invite-message');
    const acceptInviteBtn = document.getElementById('accept-invite-btn');
    const declineInviteBtn = document.getElementById('decline-invite-btn');
    const instrumentSelection = document.getElementById('instrument-selection');
    const instrumentSelect = document.getElementById('instrument-select');
    const confirmInstrumentBtn = document.getElementById('confirm-instrument-btn');

    let currentRoom = roomNameInput.value;
    let user = null;
    let token = null;
    let invitedToRoom = null;

    // --- Auth Functions (already defined) ---
    const handleSignup = async () => {
        const username = signupUsernameInput.value.trim();
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value.trim();

        if (username && email && password) {
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Signup successful:', data);
                    await handleLogin(email, password);
                } else {
                    const error = await response.json();
                    console.error('Signup error:', error.message);
                    alert(`Signup failed: ${error.message}`);
                }
            } catch (error) {
                console.error('Network error during signup:', error);
                alert('Network error during signup. Please try again.');
            }
        } else {
            alert('Please fill in all signup fields.');
        }
    };

    const handleLogin = async (email, password) => {
        if (!email || !password) {
            email = loginEmailInput.value.trim();
            password = loginPasswordInput.value.trim();
        }

        if (email && password) {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Login successful:', data);
                    user = data.user;
                    token = data.token;
                    updateUIAfterLogin();
                    socket.emit('registerUser', user.username); // Register username with socket
                } else {
                    const error = await response.json();
                    console.error('Login error:', error.message);
                    alert(`Login failed: ${error.message}`);
                }
            } catch (error) {
                console.error('Network error during login:', error);
                alert('Network error during login. Please try again.');
            }
        } else {
            alert('Please fill in both email and password.');
        }
    };

    const handleLogout = () => {
        user = null;
        token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        updateUIAfterLogout();
    };

    const updateUIAfterLogin = () => {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'none';
        userInfoDiv.style.display = 'block';
        usernameDisplay.textContent = user.username;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    };

    const updateUIAfterLogout = () => {
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'block';
        userInfoDiv.style.display = 'none';
        usernameDisplay.textContent = '';
    };

    const checkLoggedInUser = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            user = JSON.parse(storedUser);
            token = storedToken;
            updateUIAfterLogin();
            socket.emit('registerUser', user.username); // Register on page load
        }
    };

    // --- Room and Invite Functions ---
    const handleCreateRoom = () => {
        const roomName = newRoomNameInput.value.trim();
        if (roomName) {
            socket.emit('createRoom', roomName);
            newRoomNameInput.value = '';
        }
    };

    const handleJoinRoom = (roomName) => {
        socket.emit('joinRoom', roomName);
    };

    const handleLeaveRoom = () => {
        socket.emit('leaveRoom', currentRoom);
    };

    const handleInviteUser = () => {
        const usernameToInvite = inviteUsernameInput.value.trim();
        if (usernameToInvite && currentRoom) {
            socket.emit('inviteUser', {
                usernameToInvite,
                roomName: currentRoom
            });
            inviteUsernameInput.value = '';
        }
    };

    const handleAcceptInvite = () => {
        if (invitedToRoom) {
            instrumentSelection.style.display = 'block';
            inviteNotification.style.display = 'none';
        }
    };

    const handleDeclineInvite = () => {
        invitedToRoom = null;
        inviteNotification.style.display = 'none';
    };

    const handleConfirmInstrument = () => {
        const selectedInstrument = instrumentSelect.value;
        if (invitedToRoom) {
            handleJoinRoom(invitedToRoom);
            // You might want to send the instrument choice to the server here
            console.log(`Joined ${invitedToRoom} with ${selectedInstrument}`);
        }
        instrumentSelection.style.display = 'none';
        invitedToRoom = null;
    };

    // --- Event Listeners ---
    signupBtn.addEventListener('click', handleSignup);
    loginBtn.addEventListener('click', () => handleLogin());
    logoutBtn.addEventListener('click', handleLogout);

    createRoomBtn.addEventListener('click', handleCreateRoom);
    leaveRoomBtn.addEventListener('click', handleLeaveRoom);
    inviteBtn.addEventListener('click', handleInviteUser);
    acceptInviteBtn.addEventListener('click', handleAcceptInvite);
    declineInviteBtn.addEventListener('click', handleDeclineInvite);
    confirmInstrumentBtn.addEventListener('click', handleConfirmInstrument);

    roomList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const roomName = e.target.textContent;
            handleJoinRoom(roomName);
        }
    });


    // --- Socket.IO Event Handlers ---

    socket.on('updateRoomList', (rooms) => {
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const li = document.createElement('li');
            li.textContent = room;
            roomList.appendChild(li);
        });
    });

    socket.on('roomJoined', (roomName) => {
        currentRoom = roomName;
        currentRoomNameSpan.textContent = roomName;
        document.getElementById('room-list-container').style.display = 'none';
        currentRoomContainer.style.display = 'block';
        statusDiv.textContent = `Joined room: ${roomName}`;
    });

    socket.on('roomLeft', () => {
        currentRoom = null;
        currentRoomNameSpan.textContent = '';
        document.getElementById('room-list-container').style.display = 'block';
        currentRoomContainer.style.display = 'none';
        statusDiv.textContent = 'Left the room.';
    });

    socket.on('invite', ({ fromUser, roomName }) => {
        invitedToRoom = roomName;
        inviteMessage.textContent = `You have been invited to join ${roomName} by ${fromUser}.`;
        inviteNotification.style.display = 'block';
    });

    socket.on('inviteError', (message) => {
        alert(`Invite Error: ${message}`);
    });


    // --- Existing Piano and Recording Logic (already defined) ---

    // --- Initial Setup ---
    checkLoggedInUser();
    socket.emit('joinRoom', currentRoom); // Join default room on load
    statusDiv.textContent = `Joined room: ${currentRoom}`;

});