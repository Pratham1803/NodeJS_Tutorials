import mongoose, { Schema } from 'mongoose'; // import mongoose and its Schema
import bcrypt from 'bcrypt'; // import bcrypt for password hashing 
import jsonwebtoken from 'jsonwebtoken'; // import jsonwebtoken for token generation

// Create a new user schema with the required fields
// The user schema will store the user details in the database
const userSchema = new Schema(
    {
        username: { // The username of the user
            type: String, // The data type of the field
            required: true, // The field is required
            unique: true, // The field must be unique
            lowercase: true, // Convert the value to lowercase
            trim: true, // Remove whitespace from the value
            index: true, // Add an index to the field
        },
        email: { // The email address of the user
            type: String, // The data type of the field
            required: true, // The field is required
            unique: true, // The field must be unique
            lowercase: true, // Convert the value to lowercase
            trim: true, // Remove whitespace from the value
        },
        fullname: { // The full name of the user 
            type: String, // The data type of the field
            required: true, // The field is required
            trim: true, // Remove whitespace from the value
            index: true, // Add an index to the field
        },
        avatar: { // The avatar image of the user
            type: String, // The data type of the field
            required: true, // The field is required
        },
        coverImage: { // The cover image of the user
            type: String, // The data type of the field
        },
        // The watch history of the user
        // The watch history is an array of video objects
        watchHistory: [
            {
                type: Schema.Types.ObjectId, // The data type of the field
                ref: 'Video', // The reference to the Video model
            },
        ],
        password: { // The password of the user 
            type: String, // The data type of the field
            required: true, // The field is required
        },
        refreshToken: { // The refresh token of the user
            type: String, // The data type of the field
        },
    },
    { timestamps: true } // Add timestamps to the schema
);

// Middleware to hash the password before saving the user
// The pre method is used to run a function before saving the user
userSchema.pre('save', async function (next) { // Run the function before saving the user
    if (!this.isModified('password')) return next(); // If the password is not modified, skip the function
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
    next(); // Call the next middleware
});

// Method to check if the password is correct
// The isPasswordCorrect method is used to compare the password with the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare the password with the hashed password
};

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
    // Generate a new access token with the user details
    return jsonwebtoken.sign( // Generate a new access token
        {
            _id: this._id, // The id of the user
            username: this.username, // The username of the user
            email: this.email, // The email address of the user
            fullname: this.fullname, // The full name of the user
        }, // Payload of the token 
        process.env.ACCESS_TOKEN_SECRET, // Secret key for the token 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Expiry time for the token
    ); // Return the generated token
};

// Method to generate a refresh token for the user
// The generateRefreshToken method is used to generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
    // Generate a new refresh token with the user id
    return jsonwebtoken.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret key for the token
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Expiry time for the token
    );
};

export const User = mongoose.model('User', userSchema); // Export the User model