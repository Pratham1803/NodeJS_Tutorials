// This file contains the ApiError class which is used to handle errors in the application.
// The class extends the Error class and adds additional properties to it.
// The class takes in the status code, message, errors, and stack as arguments.
// The status code is the HTTP status code of the error.
// The message is the error message.
// The errors is an array of error messages.
class ApiError extends Error { 
  constructor(
    statusCode, // HTTP status code of the error
    message = 'Something went wrong', // Error message to be sent to the client
    errors = [], // Array of error messages
    stack = '' // Error stack trace
  ) {
    super(message); // Call the parent class constructor
    // Set the prototype explicitly.
    this.statusCode = statusCode; // HTTP status code of the error
    this.data = null; // Additional data to be sent to the
    this.message = message; // Error message to be sent to the client
    this.success = false; // Whether the request was successful or not
    this.errors = errors; // Array of error messages

    // If the stack trace is provided, set it. Otherwise, capture the stack trace.
    if (stack) {  
      this.stack = stack; // Error stack trace
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace of the error
    }
  }
}

export { ApiError }; // Export the ApiError class
