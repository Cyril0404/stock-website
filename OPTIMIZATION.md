# stock-website 优化建议文档

> 基于 codecrafters Web Server 从零构建 知识落地
> 整理时间：2026-04-02

---

## 背景

stock-website 使用 Next.js 15 App Router，部署在 Vercel 上。数据由 Mac Mini 上的 cron 定时抓取并推送 GitHub，Vercel 的 API Routes 负责在运行时读取 `data/website_data.json` 并返回给前端。

当前已知问题：**API Routes 在 Vercel 上依赖 `process.cwd()` 读取数据文件，路径行为在 serverless 环境不稳定。**

---

## 核心问题：serverless 环境下的 path 解析

### 问题本质

Vercel 的 API Routes 运行在 **serverless 函数**里，函数执行时的工作目录（`process.cwd()`）取决于 Vercel 的构建配置，不一定是项目根目录。

```
Vercel Serverless Function 执行时：
  cwd() → /var/task 或 /vercel/path0 或其他随机目录
  ❌ process.cwd() + 'data/website_data.json' → 指向错误位置
```

codecrafters Web Server 章节的核心启示：**路径解析必须明确，不能依赖运行时工作目录。**

---

## 优化点 1：修复 path 解析 — 使用 `import.meta.url` + `fileURLToPath`

**问题：** `process.cwd()` 在 serverless 下不可靠

**方案：** 用 ESM 的 `import.meta.url` 在模块加载时解析文件位置，这是 Node.js 官方推荐的在 ESM 模块中获取文件路径的方式。

```typescript
// 旧代码（有问题）
import path from 'path';
const DATA_FILE = path.join(process.cwd(), 'data', 'website_data.json');

// ✅ 新代码（推荐）
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, '..', '..', '..', 'data', 'website_data.json');
```

**为什么更好：**
- `import.meta.url` 是模块文件自身的位置，与 cwd 无关
- 路径是相对于模块文件计算的，结果可预测
- Next.js 会将 `src/` 下的模块打包进函数代码，路径计算一致

**注意：** Next.js App Router 的 route.ts 默认是 ESM，无需额外配置。

---

## 优化点 2：数据缓存 — HTTP Cache-Control + 内存缓存

**问题：** 每次 API 请求都同步读文件，在 serverless 函数里 I/O 慢且耗冷启动时间。

**方案 A：给 API Response 加 HTTP 缓存头**

```typescript
// 在 GET 函数里
return NextResponse.json({ ... }, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
  }
});
```

- `s-maxage=60`：CDN 缓存 60 秒，减少对 serverless 函数的调用
- `stale-while-revalidate=120`：60-180 秒期间用旧数据，同时后台重新验证

**方案 B：模块级内存缓存（推荐叠加使用）**

```typescript
// 模块级别缓存
let cachedData: any = null;
let cacheTime = 0;
const CACHE_TTL = 30_000; // 30秒

async function getData() {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) {
    return cachedData;
  }
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  cachedData = JSON.parse(raw);
  cacheTime = now;
  return cachedData;
}
```

**codecrafters 启示：** HTTP 服务器的核心优化之一是缓存。这个改动相当于在 API Route 这一层加上了"读缓存"，减少重复 I/O。

---

## 优化点 3：重构为流式/边缘化读取（进阶）

**问题：** serverless 函数冷启动时，文件 I/O 慢。

**方案：** 考虑将数据层迁移到 **Vercel KV (Redis)** 或 **Supabase**，API Routes 只做查询不做文件 I/O。

```
当前架构（有问题）：
  GitHub push → Vercel 重新部署 → 数据写在仓库里
  API Route → fs.readFileSync(process.cwd() + '/data/...')  ← 慢且不稳定

优化后架构（推荐）：
  GitHub push → Vercel 重新构建（不含数据文件）
  Mac Mini cron → 直接推送数据到 Vercel KV / Supabase
  API Route → await kv.get('website_data')  ← 快速、稳定
```

**如果暂时不想迁移数据层：** 可以用 GitHub raw content 的 CDN URL 直接 fetch 数据，API Route 变成纯代理：

```typescript
// 利用 GitHub raw content CDN 作为数据源
const RAW_DATA_URL = 'https://raw.githubusercontent.com/Cyril0404/stock-website/main/data/website_data.json';

export async function GET() {
  const res = await fetch(RAW_DATA_URL, { next: { revalidate: 30 } });
  const data = await res.json();
  return NextResponse.json({ success: true, data });
}
```

**优势：**
- 不依赖 `process.cwd()`，完全不碰服务器文件系统
- 利用 Vercel 的 fetch 缓存减少 GitHub 请求
- 架构与 serverless 完全兼容

---

## 总结

| 优化点 | 改动难度 | 预期收益 | 推荐优先级 |
|--------|---------|---------|-----------|
| 1. 修复 path 解析 | 低（改 1 行） | 解决 Vercel 数据读取失败 | 🔴 立刻做 |
| 2. HTTP 缓存头 | 低（加 headers） | 减少 serverless 调用次数 | 🔴 立刻做 |
| 3. 内存缓存 | 低（加模块变量） | 减少重复文件 I/O | 🟡 下个版本 |
| 4. 数据迁移到 KV/Supabase | 高 | 彻底解决 serverless 文件问题 | 🟡 规划中 |

**第一步建议：** 先做优化点 1+2，这两个加起来 10 分钟能改完，效果立竿见影。
