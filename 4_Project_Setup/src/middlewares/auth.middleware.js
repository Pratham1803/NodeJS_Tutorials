import { ApiError } from '../utils/ApiError.js'; // Import the ApiError class from the ApiError.js file
import { asyncHandler } from '../utils/asyncHandler.js'; // Import the asyncHandler function from the asyncHandler.js file
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library to handle JWT tokens
import { User } from '../models/user.model.js'; // Import the User model from the user.model.js file

// Middleware to verify the JWT token and authenticate the user
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get the JWT token from the request headers or cookies
        // The JWT token can be passed in the Authorization header or as a cookie
        const token =
            req.cookies?.accessToken || // Check if the token is passed as a cookie
            req.header('Authorization')?.replace('Bearer ', ''); // Check if the token is passed in the Authorization header 

        // If the token is not found, throw an error
        if (!token) { 
            throw new ApiError(401, 'Unauthorized Request'); // Throw an unauthorized request error
        }

        // Verify the JWT token using the secret key
        // The verify method decodes the token and verifies the signature
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

        // Find the user in the database using the decoded token
        // Select the fields to return from the database
        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        ); // Find the user by id and exclude the password and refresh token

        // If the user is not found, throw an error 
        if (!user) { 
            throw new ApiError(401, 'Invalid Access Token'); // Throw an invalid access token error
        }

        req.user = user; // Set the user in the request object
        next(); // Call the next middleware 
    } catch (error) {
        // If an error occurs, throw an error with the status code and message
        throw new ApiError(401, error?.message || 'Invalid Access Token',);
    }
});
