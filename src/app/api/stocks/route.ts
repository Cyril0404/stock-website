import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use relative path for Vercel compatibility
const DATA_FILE = path.join(process.cwd(), 'data', 'website_data.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const search = searchParams.get('search') || '';

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({
        success: true,
        stocks: [],
        total: 0,
        page,
        pageSize,
        stale: true
      });
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const myStocks = data.my_stocks || [];

    // Transform my_stocks to stock list format
    let stocks = myStocks.map((s: any, idx: number) => ({
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

    // Filter by search
    if (search) {
      stocks = stocks.filter((s: any) =>
        s.name.includes(search) || s.code.includes(search)
      );
    }

    const total = stocks.length;
    const start = (page - 1) * pageSize;
    const paginatedStocks = stocks.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      stocks: paginatedStocks,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error reading stocks data:', error);
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}
