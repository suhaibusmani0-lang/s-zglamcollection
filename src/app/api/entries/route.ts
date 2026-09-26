import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET() {
  try {
    const entrants = await dbService.getPublicEntrants();
    return NextResponse.json({ success: true, entrants, count: entrants.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tiktokHandle,
      fullName,
      phone,
      email,
      amountPaid,
      paymentMethod,
      transactionReference,
      receiptUrl,
      shippingAddress,
      notes
    } = body;

    if (!tiktokHandle || !fullName || !phone || !amountPaid || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields (TikTok handle, Name, Phone, Amount, Payment method).' },
        { status: 400 }
      );
    }

    const currentShow = await dbService.getCurrentShow();

    const newEntry = await dbService.addEntry({
      showId: currentShow.id,
      tiktokHandle: tiktokHandle.trim().startsWith('@') ? tiktokHandle.trim() : `@${tiktokHandle.trim()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      amountPaid: parseFloat(amountPaid) || 0,
      paymentMethod,
      transactionReference: (transactionReference || '').trim(),
      receiptUrl: receiptUrl || '',
      shippingAddress: shippingAddress || {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      notes: notes || ''
    });

    return NextResponse.json({
      success: true,
      entry: newEntry,
      ticketNumber: newEntry.ticketNumber,
      message: 'Payment verification submitted! You are officially entered in tonight’s luxury giveaway.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
