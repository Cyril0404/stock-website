// AI早报生成流程（待接入御史cron）
// 数据流：御史cron(7:30) → AI生成内容 → 写入morning_report.json → GitHub push → Vercel部署 → 前端展示

export interface MorningReport {
  date: string; // "2026-04-02"
  updatedAt: string; // "07:30"
  
  // 大盘前瞻
  marketOutlook: {
    sentiment: "乐观" | "谨慎" | "中性"; // 情绪判断
    shanghaiTrend: "高开高走" | "高开低走" | "低开高走" | "低开低走";
    keyFactors: string[]; // 影响大盘的关键因素（3条）
  };
  
  // 今日关注板块
  sectorsToWatch: {
    sector: string;
    reason: string;
    relatedStocks?: string[]; // 关联个股
  }[];
  
  // 涨停预测（AI根据复盘数据预测明日涨停潜力股）
  potentialLimitUp: {
    code: string;
    name: string;
    reason: string;
  }[];
  
  // 风险提示
  riskAlerts: string[];
  
  // 操作建议
  tradingSuggestions: {
    time: "开盘前" | "早盘" | "午盘" | "尾盘";
    action: string;
  }[];
  
  // 每日金句
  dailyQuote: {
    text: string;
    author?: string;
  };
}

// 示例数据
export const mockMorningReport: MorningReport = {
  date: "2026-04-02",
  updatedAt: "07:30",
  marketOutlook: {
    sentiment: "谨慎",
    shanghaiTrend: "低开高走",
    keyFactors: [
      "昨夜美股下跌，道指-1.2%，科技股承压",
      "北向资金昨日净流出23亿，情绪偏谨慎",
      "A股今日有IPO打新资金分流压力"
    ]
  },
  sectorsToWatch: [
    { sector: "军工", reason: "地缘事件持续发酵，消息面催化强", relatedStocks: ["002025", "600760"] },
    { sector: "医药", reason: "创新药谈判利好预期，估值修复行情" },
    { sector: "新能源", reason: "光伏组件价格企稳，季报行情启动" }
  ],
  potentialLimitUp: [
    { code: "300999", name: "某某股份", reason: "昨晚公告重大合同+技术突破" },
    { code: "002049", name: "某某科技", reason: "龙头股持续缩量，突破在即" }
  ],
  riskAlerts: [
    "大盘今日有方向选择，向下概率偏大，轻仓操作",
    "高位题材股注意获利了结"
  ],
  tradingSuggestions: [
    { time: "开盘前", action: "有持仓的观察开盘情绪，不急于加仓" },
    { time: "早盘", action: "等待10点后大盘方向明确再决策" },
    { time: "午盘", action: "大盘若持续弱势，不抄底" },
    { time: "尾盘", action: "若跌幅收窄，可小仓试探性布局明日" }
  ],
  dailyQuote: {
    text: "机会总是在恐慌中酝酿，在疯狂中消失。",
    author: "大作手回忆录"
  }
};
