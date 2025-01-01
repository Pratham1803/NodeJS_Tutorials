import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: `pratham_images/${Date.now()}`,
      folder: 'pratham_images',
    });
    console.log(`file uploaded : ${JSON.stringify(response)}`);

    return response.secure_url;
  } catch (err) {
    fs.unlinkSync(localFilePath); // remove the locally save file
    return null;
  }
};

export { uploadOnCloudinary };