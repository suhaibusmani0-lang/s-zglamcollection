import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const show = await dbService.getCurrentShow();
    const entrants = await dbService.getPublicEntrants();

    let remainingSeconds = 0;
    let isExpired = false;

    if (show.timerEndTime) {
      const diffMs = new Date(show.timerEndTime).getTime() - Date.now();
      if (diffMs > 0) {
        remainingSeconds = Math.floor(diffMs / 1000);
      } else {
        isExpired = true;
      }
    }

    return NextResponse.json({
      success: true,
      show,
      totalEntrants: entrants.length,
      remainingSeconds,
      isExpired,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch current live show state', 'SHOW_FETCH_ERROR', 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, durationMinutes, prize, status } = body;

    let updatedShow;

    if (action === 'START_TIMER') {
      const duration = Math.min(Math.max(Number(durationMinutes) || 30, 1), 120);
      updatedShow = await dbService.startPaymentWindow(duration);
    } else if (action === 'EXTEND_TIMER') {
      const extension = Math.min(Math.max(Number(durationMinutes) || 5, 1), 60);
      updatedShow = await dbService.extendTimer(extension);
    } else if (action === 'RESET_TIMER') {
      updatedShow = await dbService.resetTimer();
    } else if (action === 'UPDATE_PRIZE') {
      if (!prize || !prize.title) {
        return apiError('Prize details must include a title.', 'INVALID_PRIZE_PAYLOAD', 400);
      }
      updatedShow = await dbService.updateShow({ featuredPrize: prize });
    } else if (action === 'UPDATE_STATUS') {
      if (!['OFFLINE', 'LIVE_NOW', 'PAYMENT_WINDOW', 'ENDED'].includes(status)) {
        return apiError('Invalid status value.', 'INVALID_STATUS', 400);
      }
      updatedShow = await dbService.updateShow({ status });
    } else {
      updatedShow = await dbService.updateShow(body);
    }

    return NextResponse.json({
      success: true,
      show: updatedShow,
      message: 'Show state synchronized successfully.'
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to update show state', 'SHOW_UPDATE_ERROR', 500);
  }
}
