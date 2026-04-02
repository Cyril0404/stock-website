import { NextResponse } from 'next/server';
import { fetchData } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchData();
  if (!data) return NextResponse.json({ success: false, error: 'Data unavailable' }, { status: 503 });
  return NextResponse.json({
    success: true,
    data: {
      updated_at: data.updated_at,
      indices: data.indices || {},
      limitUpCount: Array.isArray(data.limit_up) ? data.limit_up.length : 0,
      limitDownCount: Array.isArray(data.limit_down) ? data.limit_down.length : 0,
    }
  });
}
