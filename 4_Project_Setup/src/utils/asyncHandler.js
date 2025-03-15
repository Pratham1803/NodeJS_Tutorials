// this is a middleware that will handle all the async functions in the routes
// it will catch any errors and pass them to the error handler middleware

const asyncHandler = (requestHandler) => {  
  // Return a function that takes in the request, response, and next function
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // Call the request handler and catch any errors
  };
};

export { asyncHandler }; // Export the asyncHandler function
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     res.status(err.code || 500).json({ success: false, message: err.message });
//   }
// };
