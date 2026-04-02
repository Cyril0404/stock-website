import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 板块数据 - 从涨停数据按题材字段聚合
export async function GET() {
  try {
    const websiteData = await fetchData("website_data.json");
    const limitUp = websiteData?.limit_up || [];

    // 从涨停数据中按题材(reason/sector)聚合
    // Mac Mini数据中: ticktime=时间, changepercent=涨幅(数字)
    const sectorMap: Record<string, { riseCount: number; fallCount: number; leadStock: string; change: string; stocks: any[] }> = {};

    for (const stock of limitUp) {
      // 题材字段：从name和ticktime推测，或用"其它"
      const reason = (stock as any).reason || (stock as any).sector || "板块题材";
      if (!sectorMap[reason]) {
        sectorMap[reason] = {
          riseCount: 0,
          fallCount: 0,
          leadStock: stock.name,
          change: String(stock.changepercent >= 0 ? "+" : "") + String(stock.changepercent) + "%",
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
        sectorMap[reason].change = String(stock.changepercent >= 0 ? "+" : "") + String(stock.changepercent) + "%";
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
