import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    // Collect daya from request
    const { fullName, email, username, password } = req.body;

    if (
        // check the data is not empty
        [username, password, fullName, email].some(
            (field) => field?.trim() === ''
        )
    ) {
        // if empty then return error
        throw new ApiError(400, 'All Fields are required.');
    }

    // check that given username and email id is exists or not in database
    const existedUser = User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        // if given username and email id is exists then return
        throw new ApiError(409, 'Username or Email already exists.');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; // collect avatar path
    const coverImageLocalPath = req.files?.converImage[0]?.path; // collect coverImage Path

    // throw error when local path of avatar image is not exists
    if (!avatarLocalPath) throw new ApiError(400, 'Avatar is required.');
    // if (!coverImageLocalPath) throw new ApiError(400, 'Cover image is required.');

    const avatar = await uploadOnCloudinary(avatarLocalPath); // upload avatar image on clodinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // upload coverImage image on clodinary

    if (!avatar)
        // if image is not uploaded send error message
        throw new ApiError(500, 'Error uploading avatar to cloudinary.');
    // if (!coverImage)
    //   throw new ApiError(500, 'Error uploading cover image to cloudinary.');

    // create new user with given data and save in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase(),
    });

    // check that give user is registered and stored in database
    // not collect password and refresh token from database
    const createdUser = await User.findById(user.id).select(
        '-password -refreshToken'
    );

    if (!createdUser)
        // user is not created than send error message
        throw new ApiError(500, 'Something went wrong while registering user.');

    //all done, send success response that user is registered
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, 'User Registered Successfully')
        );
});

export { registerUser };