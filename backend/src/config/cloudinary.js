import "./loadEnv.js";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary module with direct validated process.env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("[CLOUDINARY] Cloudinary SDK initialized using verified core credential variables.");

/**
 * Retries a promise-returning function with exponential backoff.
 * Prevents intermittent 499 Request Timeout / TimeoutError failures on Railway or similar serverless networks.
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`[CLOUDINARY RETRY] Attempt ${attempt} failed: ${error.message || error}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/**
 * Uploads a file (Buffer, raw filePath, or Multer file object) to Cloudinary.
 * Implements persistent retry logic, uses ultra-fast streams, and supports memoryStorage buffers natively.
 * Bypasses local temporary files completely to ensure stability in Railway and ephemeral container fleets.
 * 
 * @param {string|Buffer|object} fileInput - Absolute filePath, Buffer, or Multer file object.
 * @param {string} folder - Destination folder in Cloudinary.
 * @returns {Promise<{url: string, publicId: string}>} Complete URL and metadata.
 */
export async function uploadToCloudinary(fileInput, folder = 'rent2buy') {
  if (!fileInput) {
    throw new Error("No file content or path provided for Cloudinary upload.");
  }

  // Define the core upload task
  const performUpload = () => {
    return new Promise((resolve, reject) => {
      // Setup dynamic configuration options
      const options = {
        folder: folder,
        resource_type: "auto",
      };

      // 1. Check if we have a direct Buffer or a Multer file containing a buffer
      let buffer = null;
      if (Buffer.isBuffer(fileInput)) {
        buffer = fileInput;
      } else if (fileInput && typeof fileInput === 'object' && Buffer.isBuffer(fileInput.buffer)) {
        buffer = fileInput.buffer;
        // Clean publicId generation using the original filename safely
        if (fileInput.originalname) {
          const sanitizedOriginalName = fileInput.originalname
            .replace(/[^a-zA-Z0-9]/g, '_')
            .substring(0, 50);
          options.public_id = `${sanitizedOriginalName}-${Date.now()}`;
        }
      }

      if (buffer) {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) {
            console.error("[CLOUDINARY STREAM ERROR]:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        });

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      } else if (typeof fileInput === 'string') {
        // 2. Local filepath backup helper for backward compatibility
        cloudinary.uploader.upload(fileInput, options, (error, result) => {
          if (error) {
            console.error("[CLOUDINARY FILE UPLOAD ERROR]:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        });
      } else {
        reject(new Error("Unsupported file input format provided to Cloudinary. Must be a Buffer, Multer file, or string path."));
      }
    });
  };

  // Execute upload with retry and exponential backoff
  try {
    return await retryWithBackoff(performUpload, 3, 1000);
  } catch (error) {
    console.error(`[CLOUDINARY FATAL UPLOAD EXCEPTION] Failed after multiple retries:`, error);
    throw new Error(`Cloudinary upload failed: ${error.message || error}`);
  }
}

export default cloudinary;
