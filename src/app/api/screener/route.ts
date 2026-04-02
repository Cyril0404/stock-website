import { NextRequest, NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get("sector"); // 行业筛选
  const minChange = parseFloat(searchParams.get("minChange") || "0");
  const maxChange = parseFloat(searchParams.get("maxChange") || "100");
  const minTurnover = parseFloat(searchParams.get("minTurnover") || "0");
  const keyword = searchParams.get("keyword") || "";

  try {
    const [websiteData, limitUpData] = await Promise.all([
      fetchData("website_data.json"),
      fetchData("website_data.json"), // 同个数据源，后续可扩展
    ]);

    // 合并涨停+普通股票数据用于筛选
    const allStocks = [
      ...(limitUpData?.limit_up || []),
      ...(limitUpData?.limit_down || []),
    ];

    let results = allStocks;

    // 按关键词筛选（代码或名称）
    if (keyword) {
      const kw = keyword.toLowerCase();
      results = results.filter(
        (s: any) =>
          s.code?.toLowerCase().includes(kw) ||
          s.name?.toLowerCase().includes(kw)
      );
    }

    // 按涨跌幅筛选
    if (!isNaN(minChange) || !isNaN(maxChange)) {
      results = results.filter((s: any) => {
        const change = parseFloat(String(s.change).replace("%", "").replace("+", ""));
        return change >= minChange && change <= maxChange;
      });
    }

    // 按换手率筛选
    if (minTurnover > 0) {
      results = results.filter((s: any) => {
        const vol = parseFloat(String(s.volume || "0").replace(/[亿千万]/g, (m: string) => {
          return m === "亿" ? "*10000" : m === "万" ? "*1" : "";
        }));
        return !isNaN(vol) && vol >= minTurnover;
      });
    }

    // 按行业/题材筛选
    if (sector) {
      const sec = sector.toLowerCase();
      results = results.filter((s: any) =>
        (s.reason || "").toLowerCase().includes(sec) ||
        (s.sector || "").toLowerCase().includes(sec)
      );
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      filters: { sector, minChange, maxChange, minTurnover, keyword },
      results: results.slice(0, 50), // 最多返回50条
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "选股筛选失败" },
      { status: 500 }
    );
  }
}
