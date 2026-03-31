import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/indices`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'API request failed' }, { status: 500 });
  }
}
