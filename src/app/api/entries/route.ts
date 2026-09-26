import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { validateEntryInput } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entrants = await dbService.getPublicEntrants();
    return NextResponse.json({
      success: true,
      entrants,
      count: entrants.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to fetch entrants', 'ENTRANTS_FETCH_ERROR', 500);
  }
}

export async function POST(req: Request) {
  try {
    // 1. Rate limiting by IP/client
    const forwarded = req.headers.get('x-forwarded-for') || 'local-client';
    const clientIp = forwarded.split(',')[0].trim();
    const rateCheck = checkRateLimit(`submit_entry:${clientIp}`, 15, 60);

    if (!rateCheck.allowed) {
      return apiError(
        `Too many requests. Please wait ${rateCheck.resetInSecs} seconds before submitting again.`,
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    // 2. Parse & Validate Body
    const rawBody = await req.json();
    const validation = validateEntryInput(rawBody);

    if (!validation.valid || !validation.sanitized) {
      return apiError(
        validation.errors[0] || 'Invalid entry details provided.',
        'VALIDATION_FAILED',
        400,
        validation.errors
      );
    }

    const {
      fullName,
      phoneNumber,
      tiktokHandle,
      amountPaid,
      paymentMethod,
      shippingAddress,
      receiptUrl,
      transactionReference,
      notes
    } = validation.sanitized;

    // 3. Duplicate Prevention (same TikTok handle within last 2 minutes)
    const existingEntries = await dbService.getEntries();
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isDuplicate = existingEntries.some(
      e =>
        e.tiktokHandle.toLowerCase() === tiktokHandle.toLowerCase() &&
        new Date(e.createdAt).getTime() > twoMinutesAgo
    );

    if (isDuplicate) {
      return apiError(
        `An entry for ${tiktokHandle} was already received moments ago. Your ticket is safe! Check with host on stream.`,
        'DUPLICATE_ENTRY',
        409
      );
    }

    // 4. Save to Enterprise Store
    const currentShow = await dbService.getCurrentShow();

    const newEntry = await dbService.addEntry({
      showId: currentShow.id,
      tiktokHandle,
      fullName,
      phone: phoneNumber,
      email: '',
      amountPaid,
      paymentMethod,
      transactionReference: transactionReference || '',
      receiptUrl: receiptUrl || '',
      shippingAddress: {
        street: shippingAddress.street,
        aptSuite: shippingAddress.aptSuite || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip
      },
      notes: notes || ''
    });

    return NextResponse.json({
      success: true,
      entry: newEntry,
      ticketNumber: newEntry.ticketNumber,
      message: `Verified! Your official ticket #${newEntry.ticketNumber} is active for tonight's draw.`
    });
  } catch (error: any) {
    console.error('Error in POST /api/entries:', error);
    return apiError(error.message || 'Internal server error', 'SERVER_ERROR', 500);
  }
}
