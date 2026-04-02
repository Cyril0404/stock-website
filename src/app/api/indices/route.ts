import { NextResponse } from 'next/server';
import { fetchData } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchData();
  if (!data) return NextResponse.json({ success: false, error: 'Data unavailable' }, { status: 503 });
  const indicesObj: Record<string, any> = data.indices || {};
  const order = ['sh000001', 'sz399001', 'sz399006', 'sh000300'];
  const indicesArray = order.map(k => indicesObj[k]).filter(Boolean);
  return NextResponse.json({
    success: true,
    data: indicesArray,
    updated_at: data.updated_at
  });
}
