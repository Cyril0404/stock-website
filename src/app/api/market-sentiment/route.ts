import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const todayData = await fetchData("website_data.json");
    if (!todayData) {
      return NextResponse.json({ success: false, error: "数据获取失败" }, { status: 500 });
    }

    const limitUp = todayData.limit_up || [];
    const limitDown = todayData.limit_down || [];
    const indices = todayData.indices || [];

    const limitUpCount = limitUp.length;
    const limitDownCount = limitDown.length;

    // 找上证指数
    let shChangeNum = 0;
    for (const idx of indices) {
      const code = String(idx.code || "");
      const name = String(idx.name || "");
      if (code === "000001" || name.includes("上证")) {
        const pct = idx.pct ?? idx.change ?? idx.changepercent;
        if (pct !== undefined) {
          shChangeNum = parseFloat(String(pct).replace("%", "").replace("+", ""));
        }
        break;
      }
    }

    // 情绪得分
    const upRatio = limitUpCount / Math.max(limitDownCount, 1);
    const score = Math.min(100, Math.round(
      (limitUpCount * 0.5) + (upRatio * 10) + (shChangeNum > 0 ? 20 : 0)
    ));

    let label = "观望";
    if (score >= 75) label = "狂热";
    else if (score >= 55) label = "活跃";
    else if (score >= 40) label = "谨慎";
    else if (score < 25) label = "冰点";

    return NextResponse.json({
      success: true,
      sentiment: {
        score,
        label,
        limitUpCount,
        limitDownCount,
        upRatio: upRatio.toFixed(1),
        shChange: (shChangeNum >= 0 ? "+" : "") + shChangeNum.toFixed(2) + "%",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "情绪数据获取失败", detail: err?.message },
      { status: 500 }
    );
  }
}
