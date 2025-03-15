import { asyncHandler } from '../utils/asyncHandler.js'; // Import the asyncHandler function from the asyncHandler.js file
import { ApiError } from '../utils/ApiError.js'; // Import the ApiError class from the ApiError.js file
import { ApiResponse } from '../utils/ApiResponse.js'; // Import the ApiResponse class from the ApiResponse.js file
import { User } from '../models/user.model.js'; // Import the User model from the user.model.js file
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Import the uploadOnCloudinary function from the cloudinary.js file
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library to handle JWT tokens

const options = { // Set the options for the cookies 
    httpOnly: true, // The cookie is only accessible by the server
    secure: true, // The cookie is only sent over HTTPS
}; // The options object for the cookies

// Function to generate access and refresh tokens for the user
// The generateAccessAndRefreshToken function generates access and refresh tokens for the user
const generateAccessAndRefreshToken = async (userID) => { // The function takes the user id as an argument
    try {
        // Find the user by id and generate the access and refresh tokens
        const user = await User.findById(userID); // Find the user by id 
        const accessToken = user.generateAccessToken(); // Generate the access token
        const refreshToken = user.generateRefreshToken(); // Generate the refresh token

        user.refreshToken = refreshToken; // Set the refresh token in the user object
        // console.log('Access token : ' + accessToken);
        // console.log('Refresh token : ' + refreshToken);

        await user.save({ validateBeforeSave: false }); // Save the user object with the refresh token

        return { accessToken, refreshToken }; // Return the access and refresh tokens
    } catch (error) {
        // If an error occurs, throw an error with the status code and message
        throw new ApiError(
            500,
            'something went wrong, while generating access and refresh token'
        );
    }
};

// Controller function to register a new user in the application
const registerUser = asyncHandler(async (req, res) => { // The registerUser controller function
    // Collect the data from the request body
    const { fullName, email, username, password } = req.body;

    // Check if any of the fields are empty
    if (        
        [username, password, fullName, email].some(
            (field) => field?.trim() === ''
        ) 
    ) {        
        throw new ApiError(400, 'All Fields are required.'); // Throw an error if any field is empty
    }

    // console.log(req.files);
    // console.log(req.body);

    // Check if the username or email already exists in the database 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    }); 

    // If the user already exists, throw an error
    if (existedUser) {        
        throw new ApiError(409, 'Username or Email already exists.'); // Throw a conflict error
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; // Collect the local path of the avatar image
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; // collect coverImage Path

    let coverImageLocalPath; // Declare the cover image local path variable

    // Check if the cover image exists in the request
    if (
        req.files &&  
        Array.isArray(req.files.coverImage) && 
        req.files.coverImage.length > 0
    ) {
        // Collect the local path of the cover image
        coverImageLocalPath = req.files.coverImage[0].path; // collect coverImage Path
    }

    // throw error when local path of avatar image is not exists
    if (!avatarLocalPath) throw new ApiError(400, 'Avatar is required.');
    // if (!coverImageLocalPath) throw new ApiError(400, 'Cover image is required.');

    // Upload the avatar image to Cloudinary and get the URL
    const avatar = await uploadOnCloudinary(avatarLocalPath); // upload avatar image on clodinary
    // console.log("Avatar uploaded: "+avatar);

    // Upload the cover image to Cloudinary and get the URL
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // upload coverImage image on clodinary

    // If the avatar image is not uploaded, throw an error
    if (!avatar)
        // if image is not uploaded send error message
        throw new ApiError(500, 'Error uploading avatar to cloudinary.');
    // if (!coverImage)
    //   throw new ApiError(500, 'Error uploading cover image to cloudinary.');

    // create new user with given data and save in database

    // create new user with given data and save in database
    const user = await User.create({ // Create a new user with the provided data 
        fullname: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase(),
    }); 

    // If the user is not created, throw an error
    const createdUser = await User.findById(user.id).select(
        '-password -refreshToken' 
    ); // Find the created user by id and exclude the password and refresh token

    // If the user is not created, throw an error
    if (!createdUser)
        // user is not created than send error message
        throw new ApiError(500, 'Something went wrong while registering user.');
    
    return res // Return the response with the created user
        .status(201) // Set the status code to 201
        .json( 
            new ApiResponse(200, createdUser, 'User Registered Successfully') // Send the success response with the created user
        );
});

// Controller function to log in a user in the application
const loginUser = asyncHandler(async (req, res) => {
    // req body -> DataTransfer
    // username or email
    // find the user
    // password check
    // access token and refresh token
    // send cookies and res

    // collect username, email, and password from the request body
    const { email, password, username } = req.body;

    // validate not null username or email
    // console.log('email: ' + email);
    // console.log('UserName: ' + username);
    // console.log('Password: ' + password);

    // if username or email is not provided, throw an error
    if (!(username || email)) {
        throw new ApiError(400, 'Username or email is required');
    }

    // find user by username or email from the database
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    // if user not found, throw an error
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // check if the password is correct
    // compare the password with the hashed password in the database
    const isPasswordValid = await user.isPasswordCorrect(password);

    // if the password is not valid, throw an error
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid User Credentials');
    }

    // generate access and refresh tokens for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id 
    );

    // find the logged in user and exclude the password and refresh token
    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    ); 

    // send the access token and refresh token as cookies in the response
    // send the logged in user in the
    return res
        .status(200) // Set the status code to 200
        .cookie('accessToken', accessToken, options) // Set the access token as a cookie in the response
        .cookie('refreshToken', refreshToken, options) // Set the refresh token as a cookie in the response
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successfully'
            ) // Send the success response with the logged in user and tokens
        ); // Return the response
});

// Controller function to log out a user from the application
const logOutUser = asyncHandler(async (req, res) => { 
    // remove the refresh token from the user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        { new: true } // next response will come in updated
    );

    // clear the access token and refresh token cookies
    return res
        .status(200) // Set the status code to 200
        .clearCookie('accessToken', options) // Clear the access token cookie
        .clearCookie('refreshToken', options) // Clear the refresh token cookie
        .json(new ApiResponse(200, {}, 'User logged out successfully')); // Send the success response with an empty object
});

// Controller function to refresh the access token for the user
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken; // Get the refresh token from the cookies or request body

    // if refresh token is not provided, throw an error
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'unauthorized request');
    }

    // verify the refresh token and get the user
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ); // Verify the refresh token using the secret key  

        const user = await User.findById(decodedToken?._id); // Find the user by id from the decoded token

        // if user is not found, throw an error
        if (!user) {
            throw new ApiError(401, 'Invalid RefreshToken');
        }

        // if the incoming refresh token is not equal to the user's refresh token, throw an error
        if (incomingRefreshToken !== user?.refreshAccessToken) {
            throw new ApiError(401, 'Refresh token is expired or used');
        }

        // generate a new access token and refresh token for the user
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

            // send the new access token and refresh token as cookies in the response
        return res
            .status(200) // Set the status code to 200
            .cookie('accessToken', accessToken, options) // Set the access token as a cookie in the response
            .cookie('refreshToken', newRefreshToken, options) // Set the refresh token as a cookie in the response
            .json(
                new ApiResponse(
                    200,
                    {
                        user,
                        accessToken,
                        newRefreshToken,
                    },
                    'User refreshed access token successfully'
                ) // Send the success response with the user, access token, and refresh token
            );
    } catch (error) { // If an error occurs, throw an error with the status code and message
        throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken }; // Export the controller functions for the user