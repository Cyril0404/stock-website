import { NextResponse } from 'next/server';
import { fetchData } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchData();
    if (!data) return NextResponse.json({ success: false, error: 'Data unavailable' }, { status: 503 });
    return NextResponse.json({ success: true, data: data.limit_down || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}
