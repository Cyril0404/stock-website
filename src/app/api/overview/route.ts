import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../config';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/overview`, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'API request failed' }, { status: 500 });
  }
}
