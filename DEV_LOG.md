# stock-website 开发日志

> 更新日期：2026-04-02
> GitHub: https://github.com/Cyril0404/stock-website
> 部署: https://stock-website.vercel.app / openstock.top

---

## 一、项目概述

**定位**：券商开户获客工具 + 股票行情展示
**技术栈**：Next.js 15 (App Router) + Tailwind CSS + shadcn/ui + TypeScript
**数据源**：新浪财经 API + efinance Python库
**部署**：Vercel (GitHub 自动部署)

---

## 二、项目结构

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
├── api/
│   └── index.js                   # Express API（本地开发用，Vercel不跑）
├── fetch_data.py                  # 数据抓取脚本（efinance + 新浪）
├── PROJECT_BRIEF.md               # 项目规划书
├── FEATURES.md                    # 参考网站功能拆解
└── DEV_LOG.md                    # 本文档 - 开发日志
```

---

## 三、当前实现状态

### Phase 1 MVP ✅ 已完成

| 功能 | 状态 | 备注 |
|------|------|------|
| 首页（单页） | ✅ | 指数/涨跌停/自选股/开户 Tab |
| 指数行情 | ✅ | 上证/深证/创业板/沪深300 |
| 涨停数据 | ✅ | 新浪API，实时 |
| 跌停数据 | ✅ | 新浪API，实时 |
| 自选股展示 | ✅ | 3只演示股票 |
| 开户入口 | ✅ | 仅东莞证券一家 |
| Vercel部署 | ✅ | GitHub自动触发 |

### Phase 2 进行中

| 功能 | 状态 | 备注 |
|------|------|------|
| AI早报页 | ❌ | 未实现 |
| AI选股实验室 | ❌ | 未实现 |
| 板块热度 | ⚠️ | 只有演示数据 |
| 自选股功能（需登录） | ❌ | 未实现 |
| 券商开户页 | ⚠️ | 仅有东莞证券 |

### Phase 3 未开始

- SEO优化
- 博主合作导流
- App联动

---

## 四、技术细节

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

### 重要修复记录

| 日期 | 问题 | 修复 |
|------|------|------|
| 2026-04-02 | efinance get_latest_quote('000001') 返回平安银行而非上证指数 | 改用新浪 hq.sinajs.cn API 获取指数 |
| 2026-04-02 | API routes 使用绝对路径在Vercel不工作 | 改用 process.cwd() 相对路径 |
| 2026-04-02 | GitHub token 过期 | 更新为新token |
| 2026-04-02 | fetch_data.py 放错仓库（openclaw/website Gitee） | 复制到 stock-website 并推送 |

---

## 五、Git 操作

### 远程仓库
```
origin = https://github.com/Cyril0404/stock-website.git
token = [需在GitHub设置中查看]
```

### 常用命令
```bash
# 提交所有更改
git add .
git commit -m "描述"
git push origin main

# 数据抓取（需在 stock-website 目录）
cd /Users/zifanni/stock-website
python3 fetch_data.py
```

---

## 六、已知问题

1. ❌ 缺少数据库（Supabase/PostgreSQL） - 目前所有数据来自抓取，无持久化
2. ❌ 没有独立页面导航 - 所有功能挤在一个单页
3. ❌ 没有用户系统 - 自选股无法保存
4. ❌ AI功能缺失 - 没有早报、选股助手等
5. ⚠️ Express API (api/index.js) 是本地开发用的，Vercel不跑

---

## 七、下一步开发建议

1. **优先级高**
   - 添加页面导航（行情/选股/开户等Tab切换）
   - 完善自选股功能（本地存储 localStorage）
   - 添加更多券商开户信息

2. **优先级中**
   - AI早报页面（需对接OpenClaw生成内容）
   - 板块热度展示
   - K线图表（ECharts）

3. **优先级低**
   - 用户登录系统
   - 云端自选股同步
   - SEO优化

---

*本文档由 Claude Code 自动生成 2026-04-02*
