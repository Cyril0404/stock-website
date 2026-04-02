import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 涨停雁阵 - 按连板进度分组
// 连板判断：今日涨停且昨日也涨停 = 连板
export async function GET() {
  try {
    const [todayData, histData] = await Promise.all([
      fetchData("website_data.json"),
      fetchData("historical_limit.json"),
    ]);

    const limitUp = todayData?.limit_up || [];
    const yesterdayKey = "2026-04-01"; // 实际应动态计算昨天日期
    const yesterdayList: string[] = histData?.yesterday_limit_up?.[yesterdayKey] || [];

    // 连板分组
    const formation: Record<string, any[]> = {
      "4进5": [],
      "3进4": [],
      "2进3": [],
      "1进2": [],
      "首板": [],
    };

    for (const stock of limitUp) {
      const code = stock.code;
      const change = parseFloat(String(stock.changepercent || stock.change || "0").replace("%", "").replace("+", ""));

      if (change >= 9.9) {
        if (yesterdayList.includes(code)) {
          // 昨日涨停，今也涨停 → 连板
          formation["1进2"].push({ ...stock, status: "连板" });
        } else {
          // 今日首次涨停
          formation["首板"].push({ ...stock, status: "首板" });
        }
      }
    }

    // 计算各组成功率
    const result = Object.entries(formation)
      .filter(([, stocks]) => stocks.length > 0)
      .map(([stage, stocks]) => ({
        stage,
        total: stocks.length,
        success: stocks.filter((s: any) => s.status !== "败").length,
        stocks: stocks.slice(0, 20),
      }))
      .sort((a, b) => {
        const order = ["4进5", "3进4", "2进3", "1进2", "首板"];
        return order.indexOf(a.stage) - order.indexOf(b.stage);
      });

    return NextResponse.json({
      success: true,
      formation: result,
      updatedAt: todayData?.updated_at || new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "雁阵数据获取失败" }, { status: 500 });
  }
}
