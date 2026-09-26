/**
 * Enterprise Input Sanitization & Validation Helpers
 */

export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip basic HTML/script tags
    .slice(0, 500); // Prevent buffer bomb
}

export function normalizeTikTokHandle(handle: unknown): string {
  const clean = sanitizeString(handle).replace(/\s+/g, '');
  if (!clean) return '';
  return clean.startsWith('@') ? clean : `@${clean}`;
}

export function normalizePhoneNumber(phone: unknown): string {
  const str = sanitizeString(phone);
  // Keep only digits and common formatting symbols
  return str.replace(/[^\d+()\-\s]/g, '').slice(0, 30);
}

export function validateEntryInput(body: any): {
  valid: boolean;
  errors: string[];
  sanitized?: {
    fullName: string;
    phoneNumber: string;
    tiktokHandle: string;
    amountPaid: number;
    paymentMethod: 'ZELLE' | 'VENMO' | 'CASHAPP' | 'PAYPAL';
    shippingAddress: {
      street: string;
      aptSuite?: string;
      city: string;
      state: string;
      zip: string;
    };
    receiptUrl?: string;
    transactionReference?: string;
    notes?: string;
  };
} {
  const errors: string[] = [];

  const fullName = sanitizeString(body.fullName);
  if (!fullName || fullName.length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  const phoneNumber = normalizePhoneNumber(body.phone || body.phoneNumber);
  if (!phoneNumber || phoneNumber.length < 7) {
    errors.push('Please enter a valid phone number.');
  }

  const tiktokHandle = normalizeTikTokHandle(body.tiktokHandle);
  if (!tiktokHandle || tiktokHandle.length < 2) {
    errors.push('Please enter your TikTok username.');
  }

  const rawAmount = parseFloat(body.amountPaid);
  if (isNaN(rawAmount) || rawAmount <= 0 || rawAmount > 50000) {
    errors.push('Please enter a valid payment amount greater than $0.');
  }

  const validMethods = ['ZELLE', 'VENMO', 'CASHAPP', 'PAYPAL'];
  const method = (body.paymentMethod || '').toString().toUpperCase().replace(/_/g, '');
  const paymentMethod = validMethods.includes(method)
    ? (method as 'ZELLE' | 'VENMO' | 'CASHAPP' | 'PAYPAL')
    : 'ZELLE';

  const rawAddr = body.shippingAddress || {};
  const street = sanitizeString(rawAddr.street || body.streetAddress || body.street);
  const city = sanitizeString(rawAddr.city || body.city);
  const state = sanitizeString(rawAddr.state || body.state || 'NY').toUpperCase().slice(0, 2);
  const zip = sanitizeString(rawAddr.zip || rawAddr.zipCode || body.zipCode || body.zip).slice(0, 10);

  if (!street) errors.push('Shipping street address is required.');
  if (!city) errors.push('City is required.');
  if (!zip) errors.push('ZIP code is required.');

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      fullName,
      phoneNumber,
      tiktokHandle,
      amountPaid: Math.round(rawAmount * 100) / 100,
      paymentMethod,
      shippingAddress: {
        street,
        aptSuite: sanitizeString(rawAddr.aptSuite || ''),
        city,
        state,
        zip
      },
      receiptUrl: sanitizeString(body.receiptUrl || body.receiptImageUrl || body.receiptImage || ''),
      transactionReference: sanitizeString(body.transactionReference || ''),
      notes: sanitizeString(body.notes || '')
    }
  };
}
