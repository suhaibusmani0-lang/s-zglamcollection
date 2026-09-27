import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST() {
  try {
    const result = await dbService.pickRandomWinner();

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'No approved entries found to pick from. Please approve entries before spinning the wheel.'
      }, { status: 400 });
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
