import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const winners = await dbService.getWinners();
    return NextResponse.json({
      success: true,
      winners,
      count: winners.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to retrieve past winners', 'WINNERS_FETCH_ERROR', 500);
  }
}
