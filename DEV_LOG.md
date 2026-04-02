# stock-website 开发日志

> 更新日期：2026-04-02 17:00
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

- **Vercel**: ✅ 已通过 API 直接部署（GitHub 自动化断开）
- **openstock.top**: ✅ 所有 API 恢复正常（indices/overview/limit_up/limit_down/stocks）
- **GitHub**: ⚠️ 本地领先 origin/main 10个commit，网络超时未推送

---

## 五、重要修复记录

| 日期 | 问题 | 修复 |
|------|------|------|
| 2026-04-02 | 页面显示4个券商（缓存问题） | npm run build重建，已推送GitHub |
| 2026-04-02 | efinance get_latest_quote('000001') 返回平安银行而非上证指数 | 改用新浪 hq.sinajs.cn API |
| 2026-04-02 | API routes 使用绝对路径在Vercel不工作 | 改用 process.cwd() 相对路径 |
| 2026-04-02 | GitHub token 过期 | 更新为新token（详见TOOLS.md） |
| 2026-04-02 | fetch_data.py 放错仓库 | 复制到 stock-website 并推送 |
| 2026-04-02 | **API全500错误** — `process.cwd()` 在Vercel serverless返回`/var/task`非项目目录 | 重构数据层：API从GitHub raw URL直接fetch（`src/lib/fetchData.ts`），不依赖serverless文件系统 |
| 2026-04-02 | **域名绑错项目** — `openstock.top`绑在旧项目`stock-website-deploy`（prj_MMMZ3AS_已遮蔽），新代码部署到`stock-website`（prj_ssbVTcr） | 通过Vercel API删除域名绑定，重新添加到正确项目，域名恢复正常 |
| 2026-04-02 | **GitHub push超时** — 本地领先origin/main 10个commit，网络超时未推送 | 待网络恢复后推送，或在CC终端手动执行 |

---

## 六、已知问题

1. ⚠️ GitHub自动化部署断开 - 本地领先44个commit未推送，需点unblock链接后push
2. ❌ 缺少数据库（Supabase/PostgreSQL） - 目前所有数据来自抓取，无持久化
3. ❌ 没有独立页面导航 - 所有功能挤在一个单页
4. ❌ 没有用户系统 - 自选股无法保存
5. ❌ AI功能缺失 - 没有早报、选股助手等
6. ⚠️ Express API (api/index.js) 是本地开发用的，Vercel不跑

## 十一、项目定位（重要更新 2026-04-02）

**神冢明确：东莞证券导流网站，不是券商对比平台**

神冢是东莞证券的人，网站目的是给东莞证券导流开户，不是做多券商对比平台。
→ 开户只导东莞证券一家，不需要多券商开户对比功能
→ Phase 2优先级重新调整：AI早报 > AI选股实验室 > 板块热度

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
│   │   │   └── overview/route.ts   # 概览数据
│   │   ├── page.tsx               # 主页面（所有功能单页）
│   │   ├── layout.tsx             # 布局
│   │   └── globals.css             # 全局样式
│   ├── components/
│   │   └── ui/                    # shadcn/ui 组件
│   └── lib/
│       ├── utils.ts               # 工具函数
│       └── fetchData.ts           # GitHub raw数据获取层（30秒缓存）
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

## 十、API数据层架构（2026-04-02 重构）

### 重构原因
Vercel serverless 函数里 `process.cwd()` 返回 `/var/task`（部署根目录），不是项目目录，导致所有 API routes 读不到 `data/website_data.json`，全部返回 500 错误。

### 新架构

```
fetch_data.py (Mac Mini定时cron)
    ↓
website_data.json → git push → GitHub
    ↓
src/lib/fetchData.ts (GitHub raw URL fetch, 30秒缓存)
    ↓
API Routes (/api/indices, /api/overview, etc.)
    ↓
前端页面
```

**关键文件**：`src/lib/fetchData.ts` — 从 GitHub raw URL 直接 fetch JSON，30秒内存缓存，不依赖 serverless 文件系统。

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

---

## 十一、codecrafters 技术落地（2026-04-02）

### 来源
GitHub 80k+ ⭐ 仓库 [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x)，「从零造技术」教程合集

### 博士研究发现
31个技术方向，对 stock-website 和 OpenClawTrader 各有3个⭐⭐⭐优先级方向

### stock-website 落地成果

**文件：`OPTIMIZATION.md`（已写入项目根目录）**

| 优化点 | 优先级 | 说明 |
|--------|--------|------|
| path解析修复 | 🔴 | `process.cwd()` → `import.meta.url` + `fileURLToPath` |
| HTTP缓存头 | 🔴 | `Cache-Control: s-maxage=60, stale-while-revalidate=120` |
| 内存缓存 | 🟡 | 30秒模块级缓存，不重复读文件 |

### OpenClawTrader 落地成果

**文件：`~/openclaw/OpenClawTrader/NETWORK_IMPROVEMENT.md`**

| 改进点 | 优先级 | 说明 |
|--------|--------|------|
| 指数退避重连 | 🔴 | 断线后 1→2→4→8...秒重试，jitter避免拥塞 |
| ping/pong心跳 | 🔴 | 每25秒发ping，超时触发重连 |
| URLSession配置 | 🟡 | `waitsForConnectivity=true`，TCP保活 |
| 连接锁 | 🟡 | NSLock + ConnectionState状态机 |
| pending消息恢复 | 🟡 | 断线记录未确认消息ID，重连重发 |

---

## 十二、Vercel 部署状态（2026-04-02）

### 当前状态
- **GitHub仓库**：`Cyril0404/stock-website`，最新 commit `8b568c4`（只有东莞证券）
- **部署账号**：team_3S0syFN0683wFsywCBWHbt9Z（新账号 zifans-projects-12cbea83）
- **域名**：`openstock.top` 原绑定旧项目 `stock-website-deploy`，已迁移到正确项目
- **有效Token**：`vcp_VZZZZ_已遮蔽`（TOOLS.md已记录）

### 域名迁移记录
1. 删除了旧项目 `stock-website-deploy`（holding openstock.top）
2. `openstock.top` 已解除绑定，可重新配置到正确项目
3. 新项目 `stock-website`（prj_SSBVTC_已遮蔽）已接管 GitHub 仓库

---

*本文档由 丞相 自动更新 2026-04-02 17:25*

---

## 十三、Phase 2 功能部署（2026-04-02）

### 部署状态
- **Vercel Token**：已更新（`vcp_390gDk...`，神冢21:17提供）
- **部署方式**：`vercel --token <token> deploy --prod`
- **部署状态**：✅ 已完成

### Phase 2 API

| API | 路径 | 状态 |
|-----|------|------|
| AI早报 | `/api/morning-report` | ✅ 200 |
| AI选股 | `/api/screener` | ✅ 200 |
| 板块热度 | `/api/sectors` | ❌ 500（fetchData从GitHub拉取超时，需优化）|
| 历史涨停 | `/api/historical` | ✅ 新增 |
| 涨停结构 | `/api/limit-formation` | ✅ 新增 |
| 市场情绪 | `/api/market-sentiment` | ✅ 新增 |

### sectors 修复待办
- 问题：`fetchData()` 从GitHub raw URL拉取超时（8秒）
- 方案：数据直接内嵌到API，不走外部fetch
- 优先级：🟡 中

---

*本文档由 丞相 自动更新 2026-04-02 21:26*

---

## 十二、Phase 2 全面完成（2026-04-02）

### 今日完成清单
- [x] API数据层重构（GitHub raw fetch）
- [x] 域名迁移完成（openstock.top → 正确项目）
- [x] /api/market-sentiment 上线（情绪得分/标签）
- [x] /api/limit-formation 上线（涨停雁阵）
- [x] /api/sectors 上线（板块热度）
- [x] /api/morning-report 上线（AI早报）
- [x] /api/screener 上线（选股筛选）
- [x] /api/historical 上线（历史复盘）
- [x] 前端涨停Tab重构（雁阵图+情绪仪表）
- [x] 前端早报Tab重构（大盘前瞻+操作建议+关注板块+风险提示+金句）
- [x] 打板客功能分析文档

### Vercel部署命令（重要）
```bash
npx vercel deploy --prod --yes \
  --token=vcp_1plO1FjvcnvbYJcYPazSFSOOA0T5ZmlEhvL0yzRXheBIScRTZB2NgKVu \
  --scope=team_3S0syFN0683wFsywCBWHbt9Z
```
