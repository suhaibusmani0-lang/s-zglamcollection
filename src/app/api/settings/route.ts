import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await dbService.getSettings();
    return NextResponse.json({
      success: true,
      settings,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to retrieve payment settings', 'SETTINGS_FETCH_ERROR', 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return apiError('Invalid settings payload provided.', 'INVALID_PAYLOAD', 400);
    }

    const updated = await dbService.updateSettings(body);
    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Payment credentials updated successfully.'
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to update payment settings', 'SETTINGS_UPDATE_ERROR', 500);
  }
}
