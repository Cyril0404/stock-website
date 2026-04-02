import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

// 市场情绪指标 - 基于当日数据计算
export async function GET() {
  try {
    const [todayData, histData] = await Promise.all([
      fetchData("website_data.json"),
      fetchData("historical_limit.json"),
    ]);

    const limitUpCount = todayData?.limit_up?.length || 0;
    const limitDownCount = todayData?.limit_down?.length || 0;
    const indices = todayData?.indices || [];

    const shIndex = indices.find((i: any) =>
      (i.code === "000001" || i.name?.includes("上证"))
    );
    const shChange = shIndex?.pct || shIndex?.change || "0";
    const shChangeNum = parseFloat(String(shChange).replace("%", "").replace("+", ""));

    // 计算情绪得分 (0-100)
    const upRatio = limitUpCount / Math.max(limitDownCount, 1);
    const score = Math.min(100, Math.round(
      (limitUpCount * 0.5) +
      (upRatio * 10) +
      (shChangeNum > 0 ? 20 : 0)
    ));

    let label = "观望";
    if (score >= 75) label = "狂热";
    else if (score >= 55) label = "活跃";
    else if (score >= 40) label = "谨慎";
    else if (score < 25) label = "冰点";

    // 近5日历史趋势
    const sentimentObj = histData?.market_sentiment || {};
    const history = Object.keys(sentimentObj)
      .sort()
      .slice(-5)
      .map((date: string) => {
        const s = sentimentObj[date];
        return {
          date,
          score: s?.emotionScore ?? 50,
          label: s?.emotionLabel ?? "未知",
          twoPlusBoard: s?.twoPlusBoardCount ?? 0,
        };
      });

    return NextResponse.json({
      success: true,
      sentiment: {
        score,
        label,
        limitUpCount,
        limitDownCount,
        shChange: (shChangeNum >= 0 ? "+" : "") + shChangeNum.toFixed(2) + "%",
        upRatio: upRatio.toFixed(1),
      },
      history,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "情绪数据获取失败" },
      { status: 500 }
    );
  }
}
