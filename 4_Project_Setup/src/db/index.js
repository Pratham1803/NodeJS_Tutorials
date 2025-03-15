import mongoose  from "mongoose"; // Import mongoose package
import { DB_NAME } from "../constants.js"; // Import DB_NAME from constants.js file

// Connect to the database using the MONGODB_URL and DB_NAME environment variables
const connectDb = async () => { // Create an asynchronous function called connectDb to connect to the database
    try { // Try to connect to the database
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); // Connect to the database using the MONGODB_URL and DB_NAME environment variables
        console.log(`\nConnected to ${connectionInstance.connection.host}`); // Log a message to the console if the connection is successful
    }catch(error) { // Catch any errors that occur during the connection process
        console.error(`MongoDB Connection FAILED: ${error.message}`); // Log an error message to the console
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDb; // Export the connectDb function to be used in other files