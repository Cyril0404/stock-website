// Fetch market data from GitHub raw content (public repo)
const GITHUB_RAW = "https://raw.githubusercontent.com/Cyril0404/stock-website/main/data/website_data.json";

let cached: { data: any; ts: number } | null = null;
const CACHE_TTL = 30_000; // 30秒内复用缓存

async function fetchData() {
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
  try {
    const r = await fetch(GITHUB_RAW, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cached = { data, ts: Date.now() };
    return data;
  } catch {
    return cached?.data || null;
  }
}

export { fetchData };
