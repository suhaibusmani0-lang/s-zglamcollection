import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export function apiSuccess<T>(data: T, extra: Record<string, any> = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...extra,
      data,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

export function apiError(
  message: string,
  code = 'BAD_REQUEST',
  status = 400,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
      details: details || null,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}
