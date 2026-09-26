import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (max 10 uploads per minute per client)
    const forwarded = req.headers.get('x-forwarded-for') || 'local-client';
    const clientIp = forwarded.split(',')[0].trim();
    const rateCheck = checkRateLimit(`upload:${clientIp}`, 10, 60);

    if (!rateCheck.allowed) {
      return apiError(
        `Upload limit reached. Please wait ${rateCheck.resetInSecs} seconds before uploading another screenshot.`,
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    const data = await req.json();
    const { image, folder } = data;

    if (!image || typeof image !== 'string') {
      return apiError('No valid image data provided.', 'MISSING_IMAGE', 400);
    }

    // Guard maximum payload size (15MB base64)
    if (image.length > 15 * 1024 * 1024) {
      return apiError('Image exceeds maximum allowed size (10MB). Please take a screenshot.', 'FILE_TOO_LARGE', 413);
    }

    const secureUrl = await uploadToCloudinary(image, folder || 'sz_glam_receipts');

    return NextResponse.json({
      success: true,
      url: secureUrl,
      message: 'Screenshot uploaded and secured.'
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return apiError(error.message || 'Image processing failed', 'UPLOAD_ERROR', 500);
  }
}
