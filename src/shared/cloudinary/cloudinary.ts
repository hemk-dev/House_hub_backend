import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  format?: string;
}

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  options?: CloudinaryUploadOptions,
): Promise<UploadApiResponse> => {
  try {
    // You must use a promise to resolve the stream
    const uploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'default_folder',
          public_id: options?.public_id || `${Date.now()}-${file.originalname}`,
          format: options?.format || 'jpeg',
          timeout: 60000,
        },
        (error, result) => {
          if (error) {
            reject(`Error uploading to Cloudinary: ${error.message}`);
          }
          resolve(result);
        },
      );
      stream.end(file.buffer); // End the stream with the file buffer
    });

    const uploadResult = await uploadPromise; // Await the upload result
    console.log('🚀 ~ uploadImageToCloudinary ~ result:', uploadResult);
    return uploadResult; // Return the result
  } catch (error) {
    console.error('Error in uploadImageToCloudinary:', error);
  }
};
