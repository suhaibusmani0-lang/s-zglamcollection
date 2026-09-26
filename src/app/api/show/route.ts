import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

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
      isExpired
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, durationMinutes, prize, status } = body;

    let updatedShow;

    if (action === 'START_TIMER') {
      updatedShow = await dbService.startPaymentWindow(durationMinutes || 30);
    } else if (action === 'EXTEND_TIMER') {
      updatedShow = await dbService.extendTimer(durationMinutes || 5);
    } else if (action === 'RESET_TIMER') {
      updatedShow = await dbService.resetTimer();
    } else if (action === 'UPDATE_PRIZE') {
      updatedShow = await dbService.updateShow({ featuredPrize: prize });
    } else if (action === 'UPDATE_STATUS') {
      updatedShow = await dbService.updateShow({ status });
    } else {
      updatedShow = await dbService.updateShow(body);
    }

    return NextResponse.json({ success: true, show: updatedShow });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
