// Fetch market data from GitHub raw content (public repo)
// Supports multiple data files: website_data.json, morning_report.json

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Cyril0404/stock-website/main/data";

let cached: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL = 30_000; // 30秒内复用缓存

async function fetchData(filename: string = "website_data.json") {
  const url = `${GITHUB_RAW_BASE}/${filename}`;
  if (cached[filename] && Date.now() - cached[filename].ts < CACHE_TTL) {
    return cached[filename].data;
  }
  try {
    const r = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cached[filename] = { data, ts: Date.now() };
    return data;
  } catch {
    return cached[filename]?.data || null;
  }
}

export { fetchData };
