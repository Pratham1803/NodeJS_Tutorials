// Usage: new ApiResponse(200, {data: 'data'}, 'success message')
// The ApiResponse class is used to send responses to the client.
// The class takes in the status code, data, and message as arguments.
// The status code is the HTTP status code of the response.
// The data is the data to be sent to the client.
class ApiResponse {
  constructor(statusCode, data = null, message = 'success',) {
    this.statusCode = statusCode; // HTTP status code of the response
    this.data = data; // Data to be sent to the client
    this.message = message; // Message to be sent to the client
    this.success = statusCode < 400; // Whether the request was successful or not
  }
}

export { ApiResponse } // Export the ApiResponse class