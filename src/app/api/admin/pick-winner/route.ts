import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await dbService.pickRandomWinner();

    if (!result) {
      return apiError(
        'No eligible approved entries found to draw from. Please approve entries before spinning the wheel.',
        'NO_ELIGIBLE_ENTRIES',
        400
      );
    }

    const { winner, auditProof } = result;
    const show = await dbService.getCurrentShow();

    return NextResponse.json({
      success: true,
      winner,
      auditProof,
      show,
      message: `Winner selected! Congratulations to ${winner.fullName} (${winner.tiktokHandle}) - Ticket #${winner.ticketNumber}!`
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to select random winner', 'WINNER_SELECTION_FAILED', 500);
  }
}
