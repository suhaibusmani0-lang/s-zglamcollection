import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { image, folder } = data;

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
    }

    const secureUrl = await uploadToCloudinary(image, folder || 'sz_glam_receipts');

    return NextResponse.json({
      success: true,
      url: secureUrl
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
