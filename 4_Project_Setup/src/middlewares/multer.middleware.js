import multer from 'multer'; // Import the multer library to handle file uploads

// Create a storage engine for multer
// The storage engine specifies the destination and filename of the uploaded files
const storage = multer.diskStorage({ // Create a disk storage engine for multer
  destination: function (req, file, cb) { // Specify the destination of the uploaded files
    cb(null, './public/temp'); // The destination folder for the uploaded files
  },
  filename: function (req, file, cb) { // Specify the filename of the uploaded files
    cb(null, file.originalname); // The filename of the uploaded files
  },
});

export const upload = multer({ storage: storage }); // Create a multer instance with the storage engine
// The upload method is used to handle file uploads in the application