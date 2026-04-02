import { NextResponse } from 'next/server';
import { fetchData } from '@/lib/fetchData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const search = searchParams.get('search') || '';

    const data = await fetchData();
    if (!data) return NextResponse.json({ success: false, error: 'Data unavailable' }, { status: 503 });

    const myStocks = data.my_stocks || [];
    let stocks = myStocks.map((s: any) => ({
      code: s.code || '',
      name: s.name || '',
      price: String(s.price || ''),
      change: (parseFloat(s.pct) >= 0 ? '+' : '') + String(s.pct || '0') + '%',
      changePercent: s.pct || '0',
      open: String(s.open || s.price || ''),
      high: String(s.high || ''),
      low: String(s.low || ''),
      volume: s.volume || '',
      amount: s.amount || '',
      yesterdayClose: String(s.yesterdayClose || s.price || ''),
      type: '自选',
    }));

    if (search) {
      stocks = stocks.filter((s: any) =>
        s.name.includes(search) || s.code.includes(search)
      );
    }

    const total = stocks.length;
    const start = (page - 1) * pageSize;
    return NextResponse.json({
      success: true,
      stocks: stocks.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}
