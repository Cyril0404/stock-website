// sectors data - 直接import，构建时打包
// 路径: src/lib/sectorsData.ts -> Next.js会正确打包
import websiteDataRaw from "../../data/website_data.json";

export const websiteData = websiteDataRaw as {
  updated_at: string;
  indices: Record<string, any>;
  limit_up: any[];
  limit_down: any[];
};
