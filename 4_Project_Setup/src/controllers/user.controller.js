import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        // console.log('Access token : ' + accessToken);
        // console.log('Refresh token : ' + refreshToken);

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            'something went wrong, while generating access and refresh token'
        );
    }
};

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

    // console.log(req.files);
    // console.log(req.body);

    // check that given username and email id is exists or not in database
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        // if given username and email id is exists then return
        throw new ApiError(409, 'Username or Email already exists.');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; // collect avatar path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; // collect coverImage Path

    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path; // collect coverImage Path
    }

    // throw error when local path of avatar image is not exists
    if (!avatarLocalPath) throw new ApiError(400, 'Avatar is required.');
    // if (!coverImageLocalPath) throw new ApiError(400, 'Cover image is required.');

    const avatar = await uploadOnCloudinary(avatarLocalPath); // upload avatar image on clodinary
    // console.log("Avatar uploaded: "+avatar);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // upload coverImage image on clodinary

    if (!avatar)
        // if image is not uploaded send error message
        throw new ApiError(500, 'Error uploading avatar to cloudinary.');
    // if (!coverImage)
    //   throw new ApiError(500, 'Error uploading cover image to cloudinary.');

    // create new user with given data and save in database

    const user = await User.create({
        fullname: fullName,
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

const loginUser = asyncHandler(async (req, res) => {
    // req body -> DataTransfer
    // username or email
    // find the user
    // password check
    // access token and refresh token
    // send cookies and res

    // collect data from request
    const { email, password, username } = req.body;

    // validate not null username or email
    // console.log('email: ' + email);
    // console.log('UserName: ' + username);
    // console.log('Password: ' + password);

    if (!(username || email)) {
        throw new ApiError(400, 'Username or email is required');
    }

    // validate username or email, is it exists or not
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    // not found username or email, throw an error
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // validate password
    const isPasswordValid = await user.isPasswordCorrect(password);

    // for incorrect password, throw an error
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid User Credentials');
    }

    // collect access tokens and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successfully'
            )
        );
});

const logOutUser = asyncHandler(async (req, res) => {
    // find user and set refresh token as undefined for log out
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                "refreshToken": undefined,
            },
        },
        { new: true } // next response will come in updated
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export { registerUser, loginUser, logOutUser };
