import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchData("website_data.json");

    const limitUpCount = Array.isArray(data?.limit_up) ? data.limit_up.length : 0;
    const limitDownCount = Array.isArray(data?.limit_down) ? data.limit_down.length : 0;

    // 找上证指数
    const indices = Array.isArray(data?.indices) ? data.indices : [];
    let shChangeNum = 0;
    for (const idx of indices) {
      if ((idx.code === "000001" || String(idx.name || "").includes("上证")) && idx.pct !== undefined) {
        const raw = String(idx.pct);
        shChangeNum = parseFloat(raw.replace("%", ""));
        break;
      }
    }

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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "情绪数据获取失败", detail: msg },
      { status: 500 }
    );
  }
}
