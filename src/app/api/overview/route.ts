import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use relative path for Vercel compatibility
const DATA_FILE = path.join(process.cwd(), 'data', 'website_data.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({
        success: false,
        error: 'Data file not found'
      }, { status: 500 });
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    // overview 返回完整数据的摘要（updated_at + indices + 涨跌统计）
    return NextResponse.json({
      success: true,
      data: {
        updated_at: data.updated_at,
        indices: data.indices || {},
        limitUpCount: Array.isArray(data.limit_up) ? data.limit_up.length : 0,
        limitDownCount: Array.isArray(data.limit_down) ? data.limit_down.length : 0,
      }
    });
  } catch (error) {
    console.error('Error reading overview data:', error);
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}
