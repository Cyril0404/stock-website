/**
 * 股票助手 API 服务
 * 数据来源：新浪财经（实时）、Tushare Pro（历史）
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import iconv from 'iconv-lite';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// 新浪财经实时行情接口
const SINA_URL = 'http://hq.sinajs.cn/list';

// 指数列表
const INDICES = [
  { code: '000001', name: '上证指数', market: '1' },
  { code: '399001', name: '深证成指', market: '0' },
  { code: '399006', name: '创业板指', market: '0' },
  { code: '000688', name: '科创50', market: '1' },
  { code: '000300', name: '沪深300', market: '1' },
  { code: '000905', name: '中证500', market: '1' },
];

// Mock数据（当API不可用时使用）
const MOCK_INDICES = [
  { code: '000001', name: '上证指数', price: '3285.67', change: '+15.23', changePercent: '+0.47', volume: '3856亿', amount: '3856亿', amplitude: '0.82', high: '3298.45', low: '3265.33', open: '3270.12' },
  { code: '399001', name: '深证成指', price: '10828.56', change: '+45.78', changePercent: '+0.42', volume: '5421亿', amount: '5421亿', amplitude: '0.95', high: '10895.32', low: '10785.44', open: '10782.78' },
  { code: '399006', name: '创业板指', price: '2156.78', change: '-12.34', changePercent: '-0.57', volume: '2134亿', amount: '2134亿', amplitude: '1.23', high: '2175.22', low: '2145.67', open: '2169.12' },
  { code: '000688', name: '科创50', price: '1024.56', change: '+8.90', changePercent: '+0.88', volume: '856亿', amount: '856亿', amplitude: '1.56', high: '1032.45', low: '1015.33', open: '1015.66' },
  { code: '000300', name: '沪深300', price: '3985.67', change: '+12.45', changePercent: '+0.31', volume: '2456亿', amount: '2456亿', amplitude: '0.68', high: '3998.88', low: '3972.34', open: '3973.22' },
  { code: '000905', name: '中证500', price: '5823.45', change: '+23.67', changePercent: '+0.41', volume: '1234亿', amount: '1234亿', amplitude: '0.89', high: '5845.67', low: '5799.78', open: '5799.78' },
];

const MOCK_LIMIT_UP = [
  { code: '600518', name: 'ST康美', price: '3.45', changePercent: '+5.18', change: '0.17', volume: '2.3亿', amount: '2.3亿', reason: '债务重整', time: '09:30:00' },
  { code: '000564', name: '*ST大集', price: '1.89', changePercent: '+5.00', change: '0.09', volume: '1.2亿', amount: '1.2亿', reason: '资产重组', time: '09:30:15' },
  { code: '600212', name: '江泉实业', price: '5.67', changePercent: '+4.99', change: '0.27', volume: '8900万', amount: '8900万', reason: '业绩预增', time: '09:30:22' },
  { code: '002567', name: '唐人神', price: '8.90', changePercent: '+4.99', change: '0.42', volume: '1.5亿', amount: '1.5亿', reason: '猪肉价格', time: '09:31:05' },
  { code: '300432', name: '富临精工', price: '12.34', changePercent: '+4.98', change: '0.58', volume: '2300万', amount: '2300万', reason: '新能源', time: '09:31:33' },
];

// ==================== 工具函数 ====================

// 格式化数字
function formatNumber(num, precision = 2) {
  if (num === null || num === undefined || isNaN(num)) return '--';
  return Number(num).toFixed(precision);
}

// 格式化成交额
function formatVolume(vol) {
  if (!vol) return '0';
  if (vol >= 100000000) return (vol / 100000000).toFixed(2) + '亿';
  if (vol >= 10000) return (vol / 10000).toFixed(2) + '万';
  return vol.toString();
}

// 格式化涨跌额
function formatChange(price, yesterdayClose) {
  if (!price || !yesterdayClose) return '--';
  const change = price - yesterdayClose;
  return (change >= 0 ? '+' : '') + formatNumber(change, 2);
}

// 获取新浪实时行情
async function getRealtimeQuote(code) {
  // 新浪财经市场代码:
  // sh = 上海: 000001(上证指数), 000688(科创50), 000905(中证500), 6xxxx, 688xxx
  // sz = 深圳: 其他
  const shPrefixes = ['000001', '000688', '000905'];
  let market;
  if (shPrefixes.includes(code) || code.startsWith('6') || code.startsWith('688')) {
    market = 'sh';
  } else {
    market = 'sz';
  }
  const url = `${SINA_URL}=${market}${code}`;
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      responseType: 'arraybuffer',
      headers: {
        'Referer': 'https://finance.sina.com.cn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    // GBK编码转换
    const buffer = Buffer.from(response.data);
    const gbkString = iconv.decode(buffer, 'GBK');
    // 解析数据格式: var hq_str_xxx="名称,当前价,昨收,今开,最高,最低,...成交量,成交额,..."
    const match = gbkString.match(/"([^"]+)"/);
    if (!match) return null;

    const fields = match[1].split(',');
    const name = fields[0];
    const current = parseFloat(fields[1]) || 0;
    const yesterdayClose = parseFloat(fields[2]) || 0;
    const open = parseFloat(fields[3]) || 0;
    const high = parseFloat(fields[4]) || 0;
    const low = parseFloat(fields[5]) || 0;
    const volume = parseFloat(fields[8]) || 0; // 成交量(股)
    const amount = parseFloat(fields[9]) || 0; // 成交额(元)
    const change = current - yesterdayClose;
    const changePercent = yesterdayClose > 0 ? (change / yesterdayClose * 100) : 0;

    return {
      code: code,
      name: name || '--',
      price: formatNumber(current),
      change: formatChange(current, yesterdayClose),
      changePercent: formatNumber(changePercent, 2),
      open: formatNumber(open),
      high: formatNumber(high),
      low: formatNumber(low),
      volume: formatVolume(volume),
      amount: formatVolume(amount),
      amplitude: open > 0 ? formatNumber(((high - low) / open) * 100, 2) : '0.00',
    };
  } catch (error) {
    console.error(`获取行情失败 ${code}:`, error.message);
    return null;
  }
}

// 批量获取指数行情（带延迟避免限流）
async function getIndexQuotes() {
  const results = [];
  for (const idx of INDICES) {
    try {
      const quote = await getRealtimeQuote(idx.code);
      if (quote) {
        quote.name = idx.name;
        quote.code = idx.code;
        results.push(quote);
      }
    } catch (e) {
      console.error(`获取 ${idx.name} 失败:`, e.message);
    }
    // 延迟100ms避免请求过快
    await new Promise(r => setTimeout(r, 100));
  }
  // 如果获取失败，使用mock数据
  if (results.length === 0) {
    console.log('使用Mock指数数据');
    return MOCK_INDICES;
  }
  return results;
}

// 获取涨停板数据
async function getLimitUpStocks() {
  const url = `${EASTMONEY_LIMIT_URL}?pn=1&pz=100&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:1+t:2,m:1+t:23&fields=f2,f3,f4,f8,f9,f12,f14,f15,f16,f17,f18`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data.data;
    if (!data || !data.diff) return MOCK_LIMIT_UP;

    const stocks = data.diff.filter(item => {
      const changePercent = item.f3;
      return changePercent >= 9.9;
    }).map(item => ({
      code: item.f12,
      name: item.f14,
      price: formatNumber(item.f2),
      changePercent: formatNumber(item.f3, 2),
      change: formatNumber(item.f3 > 0 ? item.f3 : -item.f3, 2),
      volume: formatVolume(item.f47),
      amount: formatVolume(item.f48),
      reason: item.f8 || '--',
      time: item.f18 || '--',
    }));
    return stocks.length > 0 ? stocks : MOCK_LIMIT_UP;
  } catch (error) {
    console.error('获取涨停板失败:', error.message);
    return MOCK_LIMIT_UP;
  }
}

// 获取跌停板数据
async function getLimitDownStocks() {
  const url = `${EASTMONEY_LIMIT_URL}?pn=1&pz=100&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:1+t:2,m:1+t:23&fields=f2,f3,f4,f8,f9,f12,f14,f15,f16,f17,f18`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data.data;
    if (!data || !data.diff) return [];

    return data.diff.filter(item => {
      const changePercent = item.f3;
      return changePercent <= -9.9;
    }).map(item => ({
      code: item.f12,
      name: item.f14,
      price: formatNumber(item.f2),
      changePercent: formatNumber(item.f3, 2),
      volume: formatVolume(item.f47),
      amount: formatVolume(item.f48),
      reason: item.f8 || '--',
      time: item.f18 || '--',
    }));
  } catch (error) {
    console.error('获取跌停板失败:', error.message);
    return [];
  }
}

// 获取炸板股（曾涨停但炸开的）
async function getBrokenLimitStocks() {
  // 东方财富没有直接提供炸板股接口，这里返回最近炸板的模拟数据
  // 实际应该通过实时监控获取
  return [];
}

// 获取概念板块
async function getSectors() {
  const url = 'http://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=50&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2+f:!50&fields=f2,f3,f4,f8,f12,f14,f20,f21,f23,f24,f25,f26,f27,f28,f29,f30,f31,f32,f33,f34,f35,f36,f37,f38,f39,f40,f41,f42,f62';
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data.data;
    if (!data || !data.diff) return [];

    return data.diff.map(item => ({
      name: item.f14,
      changePercent: formatNumber(item.f3, 2),
      riseCount: item.f20 || 0,
      fallCount: item.f21 || 0,
      leadStock: item.f15 || '--',
      leadCode: item.f12 || '--',
      amount: formatVolume(item.f6),
    })).sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent));
  } catch (error) {
    console.error('获取概念板块失败:', error.message);
    return [];
  }
}

// 获取全市场股票列表（分页）
async function getStockList(page = 1, pageSize = 50) {
  const url = `${EASTMONEY_LIMIT_URL}?pn=${page}&pz=${pageSize}&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13,m:1+t:2,m:1+t:23&fields=f2,f3,f4,f8,f9,f12,f14,f15,f16,f17,f18,f62`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data.data;
    if (!data || !data.diff) return { stocks: [], total: 0 };

    const stocks = data.diff.map(item => ({
      code: item.f12,
      name: item.f14,
      price: formatNumber(item.f2),
      changePercent: formatNumber(item.f3, 2),
      change: formatNumber(item.f3 > 0 ? item.f3 : -item.f3, 2),
      volume: formatVolume(item.f47),
      amount: formatVolume(item.f48),
      high: formatNumber(item.f15),
      low: formatNumber(item.f16),
      open: formatNumber(item.f17),
      yesterdayClose: formatNumber(item.f18),
    }));

    return {
      stocks,
      total: data.total || stocks.length,
      page,
      pageSize
    };
  } catch (error) {
    console.error('获取股票列表失败:', error.message);
    return { stocks: [], total: 0 };
  }
}

// ==================== API 路由 ====================

// 首页概览
app.get('/api/overview', async (req, res) => {
  try {
    const indices = await getIndexQuotes();

    const [limitUp, limitDown, sectors] = await Promise.all([
      getLimitUpStocks(),
      getLimitDownStocks(),
      getSectors(),
    ]);

    res.json({
      success: true,
      data: {
        indices: indices,
        limitUpCount: limitUp.length,
        limitDownCount: limitDown.length,
        hotSectors: sectors.slice(0, 5),
        updatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('概览数据获取失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 指数列表
app.get('/api/indices', async (req, res) => {
  try {
    const indices = await getIndexQuotes();
    res.json({ success: true, data: indices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 实时行情
app.get('/api/quote/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const quote = await getRealtimeQuote(code);
    if (!quote) {
      return res.status(404).json({ success: false, error: '股票不存在' });
    }
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 涨停板
app.get('/api/limit_up', async (req, res) => {
  try {
    const stocks = await getLimitUpStocks();
    res.json({ success: true, data: stocks, total: stocks.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 跌停板
app.get('/api/limit_down', async (req, res) => {
  try {
    const stocks = await getLimitDownStocks();
    res.json({ success: true, data: stocks, total: stocks.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 股票列表（全市场）
app.get('/api/stocks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 50, 100);
    const result = await getStockList(page, pageSize);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 概念板块
app.get('/api/sectors', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const sectors = await getSectors();
    res.json({
      success: true,
      data: sectors.slice(0, parseInt(limit)),
      total: sectors.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 宏观指标（简化版，需要接入真实数据源）
app.get('/api/macro/:indicator', async (req, res) => {
  const { indicator } = req.params;
  const indicators = {
    buffett_indicator: {
      name: '巴菲特指标',
      value: '118.5%',
      change: '+2.3%',
      description: '股市/GDP比是否过热',
      status: '过热',
    },
    stock_bond_spread: {
      name: '股债利差',
      value: '2.85%',
      change: '+0.15%',
      description: '股票相对债券吸引力',
      status: '正常',
    },
    copper_oil_ratio: {
      name: '铜油比',
      value: '0.085',
      change: '-1.2%',
      description: '工业景气度与通胀预期',
      status: '正常',
    },
    gold_silver_ratio: {
      name: '金银比',
      value: '78.5',
      change: '+0.8%',
      description: '贵金属相对价值',
      status: '正常',
    },
    deposit_market_ratio: {
      name: '存款市值比',
      value: '65.2%',
      change: '+3.5%',
      description: '居民资金入市情况',
      status: '偏高',
    },
    turnover_m2_ratio: {
      name: '成交额M2比',
      value: '8.5%',
      change: '+0.9%',
      description: '市场交易活跃度',
      status: '活跃',
    },
  };

  if (indicators[indicator]) {
    res.json({ success: true, data: indicators[indicator] });
  } else {
    res.status(404).json({ success: false, error: '指标不存在' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`股票 API 服务已启动: http://localhost:${PORT}`);
  console.log(`数据来源: 东方财富 (实时)`);
});

export default app;
