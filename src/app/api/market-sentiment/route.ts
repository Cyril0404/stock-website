import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 市场情绪指标
export async function GET() {
  try {
    const [todayData, histData] = await Promise.all([
      fetchData("website_data.json"),
      fetchData("historical_limit.json"),
    ]);

    const limitUpCount = todayData?.limit_up?.length || 0;
    const limitDownCount = todayData?.limit_down?.length || 0;
    const indices = todayData?.indices || [];

    // 找到上证指数
    const shIndex = indices.find((i: any) => i.code === "000001" || i.name?.includes("上证"));
    const shChange = shIndex?.pct || shIndex?.change || "0";

    // 计算情绪得分 (0-100)
    // 涨停多+跌停少+大盘涨 = 高情绪
    const upRatio = limitUpCount / Math.max(limitDownCount, 1);
    const emotionScore = Math.min(100, Math.round(
      (limitUpCount * 0.5) +
      (upRatio * 10) +
      (parseFloat(String(shChange).replace("%", "").replace("+", "")) > 0 ? 20 : 0)
    ));

    let emotionLabel = "观望";
    if (emotionScore >= 75) emotionLabel = "狂热";
    else if (emotionScore >= 55) emotionLabel = "活跃";
    else if (emotionScore >= 40) emotionLabel = "谨慎";
    else if (emotionScore < 25) emotionLabel = "冰点";

    // 近5日情绪趋势
    const sentimentHistory = Object.entries(histData?.market_sentiment || {})
      .slice(0, 5)
      .map(([date, data]: [string, any]) => ({
        date,
        score: data.emotionScore,
        label: data.emotionLabel,
        twoPlusBoard: data.twoPlusBoardCount,
      }))
      .reverse();

    return NextResponse.json({
      success: true,
      sentiment: {
        score: emotionScore,
        label: emotionLabel,
        limitUpCount,
        limitDownCount,
        shChange,
        upRatio: upRatio.toFixed(1),
      },
      history: sentimentHistory,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "情绪数据获取失败" }, { status: 500 });
  }
}
