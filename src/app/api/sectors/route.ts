import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// 板块数据 - 从涨停数据按题材字段聚合
// 2026-04-02: 移除外部fetch依赖，用fs直接读本地JSON
function getWebsiteData() {
  try {
    const filePath = join(process.cwd(), "data", "website_data.json");
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const websiteData = getWebsiteData();
    if (!websiteData) {
      return NextResponse.json({ success: false, error: "数据文件不存在" }, { status: 500 });
    }

    const limitUp = websiteData?.limit_up || [];

    // 从涨停数据中按题材(reason/sector)聚合
    const sectorMap: Record<string, { riseCount: number; fallCount: number; leadStock: string; change: string; stocks: any[] }> = {};

    for (const stock of limitUp) {
      const reason = (stock as any).reason || (stock as any).sector || "其它";
      const changeStr = String(stock.changepercent >= 0 ? "+" : "") + String(stock.changepercent) + "%";
      if (!sectorMap[reason]) {
        sectorMap[reason] = {
          riseCount: 0,
          fallCount: 0,
          leadStock: stock.name,
          change: changeStr,
          stocks: []
        };
      }
      sectorMap[reason].riseCount++;
      sectorMap[reason].stocks.push(stock);

      // 取涨幅最大的为龙头
      const currentChange = parseFloat(String(stock.changepercent || "0"));
      const leadStr = sectorMap[reason].change.replace("%", "").replace("+", "");
      const leadChange = parseFloat(leadStr);
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
        topStocks: data.stocks.slice(0, 3),
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
      { status: 500 }
    );
  }
}
