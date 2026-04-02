import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use relative path for Vercel compatibility
const DATA_FILE = path.join(process.cwd(), 'data', 'website_data.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Fallback: return mock data if file doesn't exist
      return NextResponse.json({
        success: true,
        data: [],
        stale: true,
        message: 'Data file not found, using empty data'
      });
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const indicesObj = data.indices || {};
    // Convert to array with guaranteed order: 上证, 深证, 创业板, 沪深300
    const order = ['sh000001', 'sz399001', 'sz399006', 'sh000300'];
    const indicesArray = order.map(k => indicesObj[k]).filter(Boolean);
    return NextResponse.json({
      success: true,
      data: indicesArray,
      updated_at: data.updated_at
    });
  } catch (error) {
    console.error('Error reading indices data:', error);
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}
