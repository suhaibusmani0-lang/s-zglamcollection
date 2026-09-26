import { v2 as cloudinary } from 'cloudinary';

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export async function uploadToCloudinary(
  base64OrBuffer: string,
  folder = 'sz_glam_receipts'
): Promise<string> {
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(base64OrBuffer, {
        folder: folder,
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to direct data URL:', err);
    }
  }

  return base64OrBuffer;
}
