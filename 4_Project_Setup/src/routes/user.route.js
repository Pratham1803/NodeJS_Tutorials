import { Router } from 'express'; // Import express Router method
// Import the user controller methods that we will use to handle the routes
// These methods are imported from the user.controller.js file
import {
    registerUser, // Import the registerUser method that will handle the user registration
    loginUser, // Import the loginUser method that will handle the user login
    logOutUser, // Import the logOutUser method that will handle the user logout
    refreshAccessToken, // Import the refreshAccessToken method that will handle the token refresh
} from '../controllers/user.controller.js'; // Import the user controller methods
import { upload } from '../middlewares/multer.middleware.js'; // Import the upload method from the multer middleware 
import { verifyJWT } from '../middlewares/auth.middleware.js'; // Import the verifyJWT method from the auth middleware 

const router = Router(); // Create a new router instance

// Public routes that do not require authentication
router.route('/register').post( // Create a new user registration route that accepts POST requests 
    // The route uses the upload middleware to handle file uploads
    // The upload middleware is used to upload the user avatar and cover image
    upload.fields([ 
        {
            name: 'avatar', // The name of the avatar field in the form data
            maxCount: 1, // The maximum number of files that can be uploaded
        },
        {
            name: 'coverImage', // The name of the cover image field in the form data
            maxCount: 1, // The maximum number of files that can be uploaded
        },
    ]), // The fields method is used to specify the fields to be uploaded
    registerUser // The route handler method that will handle the user registration
);

router.route('/login').post(loginUser); // Create a new user login route that accepts POST requests 

// Protected routes that require authentication using JWT
router.route('/logout').post(verifyJWT, logOutUser); // Create a new user logout route that accepts POST requests 
router.route('/refresh-token').post(refreshAccessToken); // Create a new token refresh route that accepts POST requests

export default router; // Export the router instance with the defined routes