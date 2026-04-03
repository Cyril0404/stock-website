import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 涨停雁阵 - 按连板进度分组
// 数据源：akshare stock_zt_pool_zhub_dt_em，continue_list 字段表示当前连板数
// 分组规则：首板→1进2 / 2连板→2进3 / 3连板→3进4 / 4连板+→4连板+
export async function GET() {
  try {
    const data = await fetchData("website_data.json");
    const limitUp = data?.limit_up || [];

    // 按 continue_list 分组
    // continue_list=1: 首板（今日首次涨停）→ 明日尝试1进2
    // continue_list=2: 2连板 → 明日尝试2进3
    // continue_list=3: 3连板 → 明日尝试3进4
    // continue_list>=4: 4连板+ → 明日尝试4进5+
    const groups: Record<string, any[]> = {
      "4进5+": [],
      "3进4": [],
      "2进3": [],
      "1进2": [],
    };

    for (const stock of limitUp) {
      const change = parseFloat(String(stock.changepercent || stock.change || "0").replace("%", "").replace("+", ""));
      if (change < 9.9) continue;

      const cl = Number(stock.continue_list ?? 1);

      if (cl >= 4) {
        groups["4进5+"].push({ ...stock, status: cl + "连板" });
      } else if (cl === 3) {
        groups["3进4"].push({ ...stock, status: "3连板" });
      } else if (cl === 2) {
        groups["2进3"].push({ ...stock, status: "2连板" });
      } else {
        // cl === 1: 首板（昨日未涨停，今日首次涨停）
        groups["1进2"].push({ ...stock, status: "首板" });
      }
    }

    const result = Object.entries(groups)
      .filter(([, stocks]) => stocks.length > 0)
      .map(([stage, stocks]) => ({
        stage,
        total: stocks.length,
        success: stocks.filter((s: any) => s.status?.includes("连板")).length,
        stocks: stocks.slice(0, 30),
      }))
      .sort((a, b) => {
        const order = ["4进5+", "3进4", "2进3", "1进2"];
        return order.indexOf(a.stage) - order.indexOf(b.stage);
      });

    return NextResponse.json({
      success: true,
      formation: result,
      updatedAt: data?.updated_at || new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "雁阵数据获取失败" }, { status: 500 });
  }
}
