import http from 'http';
import app from './app.js'; // Import the app from app.js

const PORT = process.env.PORT || 3000; // Default to 3000 or use the port from the environment variables

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
