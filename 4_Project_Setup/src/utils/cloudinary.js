import { v2 as cloudinary } from 'cloudinary'; // import cloudinary v2 api
import fs from 'fs'; // import file system module

// Configure cloudinary with the cloud name, api key, and api secret
// These values are obtained from the cloudinary dashboard
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // cloud name from the cloudinary dashboard
    api_key: process.env.CLOUDINARY_API_KEY, // api key from the cloudinary dashboard
    api_secret: process.env.CLOUDINARY_API_SECRET, // api secret from the cloudinary dashboard
});

// Function to upload a file to cloudinary and return the response
// The function takes in the local file path as an argument
// The function uploads the file to cloudinary and returns the response
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // if no file path is provided, return null
        const response = await cloudinary.uploader.upload(localFilePath, { // upload the file to cloudinary
            public_id: `pratham_images/${Date.now()}`, // public id of the file
            folder: 'pratham_images', // folder in which the file will be
        }); // uploaded to cloudinary

        fs.unlinkSync(localFilePath); // remove the locally save file

        return response; // return the response from cloudinary
    } catch (err) { // catch any errors that occur during the upload process
        fs.unlinkSync(localFilePath); // remove the locally save file
        return null; // return null if an error occurs
    }
};

export { uploadOnCloudinary }; // export the uploadOnCloudinary function
