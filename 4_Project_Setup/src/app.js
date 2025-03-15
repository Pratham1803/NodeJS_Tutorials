// Description: Main application file
// The app.js file is the main application file that contains the Express application and all the middleware and routes that the application uses. The app.js file is imported into the index.js file, where the application is started by connecting to the database and starting the server. The app.js file contains the following code:
import express from 'express'; // Import express package
import cors from 'cors'; // Import cors package to enable cross-origin resource sharing
import cookieParser from 'cookie-parser'; // Import cookie-parser package to parse cookies

const app = express(); // Create an instance of the express application

// Middleware to enable cross-origin resource sharing
// and parse incoming requests with JSON payloads
app.use( 
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from the client
    credentials: true, // Allow cookies to be sent and received
  })
);

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: '16kb' })); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse incoming requests with URL-encoded payloads
app.use(express.static('public')); // Serve static files from the public directory
app.use(cookieParser()); // Parse cookies in the incoming requests 

// routes import 
import userRouter from './routes/user.route.js'; // Import userRouter from routes/user.route.js

// Use the userRouter for requests to the /api/v1/users endpoint
// This means that all requests to the /api/v1/users endpoint will be handled by the userRouter
app.use('/api/v1/users', userRouter); 

export { app }; // Export the express application