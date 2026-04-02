import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 板块数据映射（后续替换为东方财富真实API）
// 当前使用涨停数据中的reason字段聚合统计
export async function GET() {
  try {
    const websiteData = await fetchData("website_data.json");
    const limitUp = websiteData?.limit_up || [];

    // 从涨停数据中聚合板块信息
    const sectorMap: Record<string, { riseCount: number; fallCount: number; leadStock: string; change: string; stocks: any[] }> = {};

    for (const stock of limitUp) {
      const reason = stock.reason || "其它";
      if (!sectorMap[reason]) {
        sectorMap[reason] = { riseCount: 0, fallCount: 0, leadStock: stock.name, change: stock.change, stocks: [] };
      }
      sectorMap[reason].riseCount++;
      sectorMap[reason].stocks.push(stock);
      // 取涨幅最大的为lead stock
      const currentChange = parseFloat(stock.change.replace("%", "").replace("+", ""));
      const leadChange = parseFloat(sectorMap[reason].change.replace("%", "").replace("+", ""));
      if (currentChange > leadChange) {
        sectorMap[reason].leadStock = stock.name;
        sectorMap[reason].change = stock.change;
      }
    }

    // 转换为数组并排序（按涨停数量降序）
    const sectors = Object.entries(sectorMap)
      .map(([sector, data]) => ({
        sector,
        riseCount: data.riseCount,
        fallCount: 0,
        leadStock: data.leadStock,
        change: data.change,
        topStocks: data.stocks.slice(0, 3), // 该板块前3只涨停股
      }))
      .sort((a, b) => b.riseCount - a.riseCount)
      .slice(0, 20); // 最多20个板块

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
