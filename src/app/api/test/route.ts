import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Test endpoint - no file system access
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    time: new Date().toISOString()
  });
}
