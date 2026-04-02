import { NextRequest, NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 历史复盘数据 - 按日期查询历史涨停/跌停
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // 格式: 20260402 或 2026-04-02

  if (!date) {
    return NextResponse.json({ success: false, error: "缺少date参数" }, { status: 400 });
  }

  try {
    const histData = await fetchData("historical_limit.json");

    // 转换日期格式
    const normalizedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    const dateKey = Object.keys(histData.dates).find(k => histData.dates[k] === normalizedDate);

    if (!dateKey) {
      return NextResponse.json({
        success: true,
        data: {
          date: normalizedDate,
          limitUpCount: 0,
          limitDownCount: 0,
          market: "数据暂不可用",
          note: "历史数据需提前配置，请联系管理员添加",
        },
      });
    }

    return NextResponse.json({
      success: true,
      date: normalizedDate,
      sentiment: histData.market_sentiment[normalizedDate] || null,
      available: histData.dates.includes(normalizedDate),
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "历史数据获取失败" }, { status: 500 });
  }
}
