import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Use relative path for Vercel compatibility
const DATA_FILE = path.join(process.cwd(), 'data', 'website_data.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ success: true, data: [], stale: true });
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data: data.limit_up || [] });
  } catch (error) {
    console.error('Error reading limit_up data:', error);
    return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
  }
}
