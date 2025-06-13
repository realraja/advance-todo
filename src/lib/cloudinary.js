// lib/cloudinary.js
const cloudinary = require('cloudinary').v2;


const folderName = process.env.DB_NAME || "Todo App"; // Set your folder name here

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// export const uploadResponse = async(files) => {
//     const uploadedUrl = await cloudinary.uploader.upload(files, {
//       folder: folderName,
//     });

//     return uploadedUrl;
// }

export const uploadResponse = async (files) => {
  try {
    if (!Array.isArray(files)) {
      throw new Error("Expected an array of files.");
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file, {
        folder: folderName,
        resource_type: "auto", // Support any file type
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Return array of uploaded file URLs or full metadata
    return uploadResults.map(result => result.secure_url);

  } catch (error) {
    console.error('Upload error:', error);
    throw new Error("File upload failed. " + error.message);
  }
};

export const uploadFileResponse = async (files) => {
  try {
    if (!files) {
      throw new Error("No files provided for upload.");
    }

    // Convert single file to array for consistent processing
    const filesArray = Array.isArray(files) ? files : [files];

    if (filesArray.length === 0) {
      throw new Error("At least one file must be provided.");
    }

    const uploadPromises = filesArray.map((file) => {
      // Validate the file object
      if (!file) {
        throw new Error("Invalid file provided.");
      }

      // For Cloudinary, you might need to handle different file types differently
      // If the file is a path (string), Cloudinary can handle it directly
      // If it's a Buffer or Stream, you might need to adjust the upload options
      const uploadOptions = {
        folder: folderName,
        resource_type: 'auto', // Let Cloudinary detect the file type automatically
      };

      return cloudinary.uploader.upload(file, uploadOptions);
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Return array of uploaded file information (URL and other metadata)
    return uploadResults.map(result => (result.secure_url));
    
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};



const mimeToExtension = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "video/webm": "webm",
  // Add more as needed
};

export const getFileInfoFromBase64 = (base64) => {
  const matches = base64.match(/^data:(.*);base64,/);
  if (!matches || matches.length < 2) {
    throw new Error("Invalid base64 file string");
  }

  const mimeType = matches[1];
  const extension = mimeToExtension[mimeType] || "bin"; // fallback
  let resource_type = "raw";

  if (mimeType.startsWith("image/")) resource_type = "image";
  else if (mimeType.startsWith("video/") || mimeType.startsWith("audio/"))
    resource_type = "video";

  return { mimeType, extension, resource_type };
};


