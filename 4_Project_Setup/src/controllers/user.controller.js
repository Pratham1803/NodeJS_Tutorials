import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log('registered user');

  res.status(200).json({
    message: 'User registration',
  });  
});

export { registerUser };