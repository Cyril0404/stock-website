import { NextResponse } from "next/server";
import websiteDataRaw from "@/data/website_data.json";

export const dynamic = "force-dynamic";

// 板块数据 - 从涨停数据的行业字段聚合
// 2026-04-03 v3: 使用 @import 替代 fs（Next.js构建时打包，解决serverless路径问题）
type WebsiteData = {
  updated_at: string;
  indices: Record<string, any>;
  limit_up: any[];
  limit_down: any[];
};

const websiteData = websiteDataRaw as WebsiteData;

export async function GET() {
  try {
    if (!websiteData) {
      return NextResponse.json(
        { success: false, error: "数据不存在" },
        { status: 200 }
      );
    }

    const limitUp = websiteData?.limit_up || [];

    // 按行业(reason)聚合
    const sectorMap: Record<string, {
      riseCount: number;
      fallCount: number;
      leadStock: string;
      change: string;
      topStocks: any[];
    }> = {};

    for (const stock of limitUp) {
      // 优先用 reason 字段（akshare行业），没有则用"其它"
      const reason = stock.reason || stock.sector || "其它";
      const change = stock.changepercent;
      const changeStr = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

      if (!sectorMap[reason]) {
        sectorMap[reason] = {
          riseCount: 0,
          fallCount: 0,
          leadStock: stock.name,
          change: changeStr,
          topStocks: []
        };
      }

      sectorMap[reason].riseCount++;
      sectorMap[reason].topStocks.push({
        name: stock.name,
        code: stock.code,
        change: changeStr,
        boards: stock.boards || 1,
      });

      // 取该板块涨幅最大的为龙头
      const currentChange = parseFloat(String(change));
      const leadChange = parseFloat(sectorMap[reason].change.replace("%", "").replace("+", ""));
      if (currentChange > leadChange) {
        sectorMap[reason].leadStock = stock.name;
        sectorMap[reason].change = changeStr;
      }
    }

    const sectors = Object.entries(sectorMap)
      .map(([sector, data]) => ({
        sector,
        riseCount: data.riseCount,
        fallCount: data.fallCount,
        leadStock: data.leadStock,
        change: data.change,
        topStocks: data.topStocks.slice(0, 3),
      }))
      .sort((a, b) => b.riseCount - a.riseCount)
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      updatedAt: websiteData?.updated_at || new Date().toISOString(),
      sectors,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "板块数据获取失败" },
      { status: 200 }
    );
  }
}
