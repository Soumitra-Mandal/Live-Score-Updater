// Establishing WebSocket connection with the server
const socket = io();

// Event handler for when the client successfully connects to the server
socket.on('connect', () => {
    console.log('Connected to server');
});

// Event handler for receiving messages from the server
socket.on('message', (data) => {
    console.log('Received message:', data);
    });

// Event handler for receiving messages from the server
socket.on('update_score', (score) => {
    console.log('Received score:', score);
    
    // Update the UI with the received data (assuming it's a score)
    updateScore(score);
});

// Event handler for when the client disconnects from the server
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Function to update the score in the UI
function updateScore(score) {
    const scoreWindow = document.getElementById('score-window');
    scoreWindow.innerHTML = `<p>Score: runs = ${score.runs}</p><p>Score: wickets = ${score.wickets}</p>`;
}
