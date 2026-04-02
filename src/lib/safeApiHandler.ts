/**
 * Next.js API Route 安全封装
 * 作用：永远不直接500，给降级数据
 * 
 * 用法：
 * import { safeApi } from '@/lib/safeApiHandler';
 * 
 * export async function GET() {
 *   return safeApi(
 *     async () => {
 *       // 你的逻辑
 *       const data = getData();
 *       return { success: true, data };
 *     },
 *     { success: false, error: '服务暂时不可用', data: null }
 *   );
 * }
 */

import { NextResponse } from "next/server";

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: unknown;
};

export async function safeApi<T>(
  handler: () => Promise<ApiResult<T>>,
  fallback: ApiResult<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    if (!result.success) {
      return NextResponse.json(fallback, { status: 200 }); // 不返回500
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error('[API Error]', err);
    return NextResponse.json(fallback, { status: 200 }); // 不返回500
  }
}

// 示例：sectors API 重构后版本
/*
import { safeApi } from '@/lib/safeApiHandler';
import { readFileSync } from 'fs';
import { join } from 'path';

function getWebsiteData() {
  try {
    const filePath = join(process.cwd(), 'data', 'website_data.json');
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export async function GET() {
  return safeApi(
    async () => {
      const websiteData = getWebsiteData();
      if (!websiteData) {
        return { success: false, error: '数据文件不存在' };
      }
      // ...处理逻辑
      return { success: true, sectors };
    },
    { success: false, error: '板块数据获取失败', sectors: [] }
  );
}
*/
