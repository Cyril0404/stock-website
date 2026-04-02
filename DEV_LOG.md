# stock-website 开发日志

> 更新日期：2026-04-02 15:10
> GitHub: https://github.com/Cyril0404/stock-website
> 部署: https://stock-website.vercel.app / openstock.top

---

## 一、项目概述

**定位**：券商开户获客工具 + 股票行情展示
**技术栈**：Next.js 15 (App Router) + Tailwind CSS + shadcn/ui + TypeScript
**数据源**：新浪财经 API + efinance Python库
**部署**：Vercel (GitHub 自动部署)

---

## 二、当前所有进度（2026-04-02 更新）

### ✅ Phase 1 MVP 已完成

| 功能 | 状态 | 详情 |
|------|------|------|
| 首页（单页） | ✅ 完成 | 指数/涨跌停/自选股/开户 Tab 四个板块 |
| 指数行情 | ✅ 完成 | 上证/深证/创业板/沪深300，实时 |
| 涨停数据 | ✅ 完成 | 新浪API，实时 |
| 跌停数据 | ✅ 完成 | 新浪API，实时 |
| 自选股展示 | ✅ 完成 | 3只演示股票（300548/688037/603986） |
| 开户入口 | ✅ 完成 | 仅东莞证券一家（佣金万0.86） |
| Vercel部署 | ✅ 完成 | GitHub自动触发，openstock.top |
| 券商数量修复 | ✅ 完成 | 4家→仅保留东莞证券，缓存问题已修复 |
| GitHub推送 | ✅ 完成 | 2026-04-02 推送成功 |

### 🔄 Phase 2 进行中

| 功能 | 状态 | 备注 |
|------|------|------|
| AI早报页 | ❌ 未开始 | 需对接OpenClaw生成内容 |
| AI选股实验室 | ❌ 未开始 | 条件勾选+结果展示 |
| 板块热度 | ⚠️ 演示数据 | 只有演示数据，未接真实API |
| 自选股功能（需登录） | ❌ 未开始 | 需要用户系统 |
| 券商开户页多券商 | ❌ 未开始 | 仅有东莞证券 |

### ❌ Phase 3 未开始

- SEO优化
- 博主合作导流
- App联动

---

## 三、技术细节

### 数据抓取流程

```
fetch_data.py (Mac Mini定时cron)
    ↓
efinance: 获取自选股（300548/688037/603986）
新浪API: 获取指数（上证/深证/创业板/沪深300）
新浪API: 获取涨跌停名单
    ↓
website_data.json
    ↓
git add + commit + push
    ↓
Vercel 自动部署 → openstock.top 更新
```

### API Routes (Vercel服务端)

- `/api/indices` - 指数数据
- `/api/limit_up` - 涨停数据
- `/api/limit_down` - 跌停数据
- `/api/stocks` - 自选股数据
- `/api/overview` - 概览数据

### 行情数据（实时）

| 数据 | 来源 | 状态 |
|------|------|------|
| 上证指数 | 新浪 hq.sinajs.cn | ✅ 实时 |
| 深证成指 | 新浪 hq.sinajs.cn | ✅ 实时 |
| 创业板指 | 新浪 hq.sinajs.cn | ✅ 实时 |
| 沪深300 | 新浪 hq.sinajs.cn | ✅ 实时 |
| 涨停名单 | 新浪 API | ✅ 实时 |
| 跌停名单 | 新浪 API | ✅ 实时 |
| 自选股 | efinance + 新浪 | ✅ 实时 |

---

## 四、Git 操作记录

### 重要提交记录

| 日期 | Commit | 内容 |
|------|--------|------|
| 2026-04-02 | 5c935c3 | fix: 券商只保留东莞证券，修复API路径兼容Vercel |
| 2026-04-02 | c558230 | 自动更新数据 14:25:53 |
| 2026-04-02 | 32b9c66 | main <- 本地 main（推送成功） |

### 最新部署状态

- **Vercel**: ✅ 已自动部署
- **openstock.top**: ✅ 最新代码已上线
- **GitHub**: ✅ 同步到 32b9c66

---

## 五、重要修复记录

| 日期 | 问题 | 修复 |
|------|------|------|
| 2026-04-02 | 页面显示4个券商（缓存问题） | npm run build重建，已推送GitHub |
| 2026-04-02 | efinance get_latest_quote('000001') 返回平安银行而非上证指数 | 改用新浪 hq.sinajs.cn API |
| 2026-04-02 | API routes 使用绝对路径在Vercel不工作 | 改用 process.cwd() 相对路径 |
| 2026-04-02 | GitHub token 过期 | 更新为新token（详见TOOLS.md） |
| 2026-04-02 | fetch_data.py 放错仓库 | 复制到 stock-website 并推送 |

---

## 六、已知问题

1. ❌ 缺少数据库（Supabase/PostgreSQL） - 目前所有数据来自抓取，无持久化
2. ❌ 没有独立页面导航 - 所有功能挤在一个单页
3. ❌ 没有用户系统 - 自选股无法保存
4. ❌ AI功能缺失 - 没有早报、选股助手等
5. ⚠️ Express API (api/index.js) 是本地开发用的，Vercel不跑

---

## 七、项目结构

```
stock-website/
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API Routes
│   │   │   ├── indices/route.ts   # 指数数据
│   │   │   ├── limit_up/route.ts  # 涨停数据
│   │   │   ├── limit_down/route.ts # 跌停数据
│   │   │   ├── stocks/route.ts    # 自选股数据
│   │   │   ├── overview/route.ts   # 概览数据
│   │   │   └── config.ts           # API配置
│   │   ├── page.tsx               # 主页面（所有功能单页）
│   │   ├── layout.tsx             # 布局
│   │   └── globals.css             # 全局样式
│   ├── components/
│   │   └── ui/                    # shadcn/ui 组件
│   └── lib/
│       └── utils.ts               # 工具函数
├── data/
│   └── website_data.json          # 抓取的行情数据
├── fetch_data.py                  # 数据抓取脚本
├── scripts/
│   └── github-trending-daily.sh   # GitHub Trending 每日扫描
├── scripts/
│   └── blogger-daily-organizer.sh # 博主文章归档
├── api/
│   └── index.js                   # Express API（本地开发用，Vercel不跑）
├── PROJECT_BRIEF.md               # 项目规划书
├── FEATURES.md                    # 参考网站功能拆解
└── DEV_LOG.md                    # 本文档 - 开发日志
```

---

## 八、下一步开发优先级

### 优先级高 🔴
1. **添加页面导航** - 行情/选股/开户等Tab切换（当前挤在一个单页）
2. **完善自选股功能** - 本地存储 localStorage
3. **添加更多券商开户信息** - 至少3-5家对比

### 优先级中 🟡
1. **AI早报页面** - 需对接OpenClaw生成内容
2. **板块热度展示** - 接东方财富板块API
3. **K线图表** - ECharts集成

### 优先级低 🟢
1. 用户登录系统
2. 云端自选股同步
3. SEO优化

---

## 九、相关文档

| 文档 | 说明 |
|------|------|
| PROJECT_BRIEF.md | 项目规划书（产品定位/功能模块/技术方案） |
| FEATURES.md | 参考网站功能拆解（打板客/quantitative_analysis/market.zocdesign） |
| DEV_LOG.md | 本文档 - 开发日志 |

---

*本文档由 丞相 自动更新 2026-04-02 15:10*
