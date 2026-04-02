import { NextResponse } from "next/server";
import { fetchData } from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchData("morning_report");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "早报数据获取失败" },
      { status: 500 }
    );
  }
}
