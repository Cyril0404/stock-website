# 打板客网站详细功能分析报告

> 分析日期：2026-04-02
> 网址：https://dabanke.com/

---

## 目录

1. [网站概述](#1-网站概述)
2. [页面结构与导航](#2-页面结构与导航)
3. [公开功能（首页）](#3-公开功能首页)
4. [会员专属功能](#4-会员专属功能)
5. [技术架构](#5-技术架构)
6. [数据结构与字段](#6-数据结构与字段)
7. [UI组件设计](#7-ui组件设计)
8. [商业模式](#8-商业模式)
9. [参考功能清单](#9-参考功能清单)

---

## 1. 网站概述

### 1.1 基本信息

| 项目 | 内容 |
|------|------|
| 网站名称 | 打板客网 |
| 网址 | https://dabanke.com/ |
| 定位 | A股打板交易数据分析平台 |
| 服务 | 涨停复盘、龙虎榜分析、情绪周期、概念轨迹 |
| 产品 | 打板客网交易系统 1.86 版（通达信插件） |

### 1.2 免责声明

网站明确声明：
- 不提供个股买卖点、目标价、收益率预测
- 不提供仓位建议、实盘带单或跟单群
- 内容仅用于学习与复盘参考
- 不构成证券投资咨询服务或投资建议

---

## 2. 页面结构与导航

### 2.1 主导航栏

```
打板客网网首页 | 区间涨幅 | 龙虎榜分析 | 股票人气榜 | 首板反馈 | 情绪周期 | 概念轨迹 | [更多功能] | 复盘宝 | 公众号 | 登录
```

### 2.2 导航项详情

| 导航项 | URL | 访问权限 |
|--------|-----|----------|
| 打板客网首页 | / | 公开 |
| 区间涨幅 | /qjzf.html | 公开 |
| 龙虎榜分析 | /lhb.html | 会员专属 |
| 股票人气榜 | /gupiaorenqipaihangbang.html | 会员专属 |
| 首板反馈 | /sbsq.html | 会员专属 |
| 情绪周期 | /shichangqingxuzhouqiquxiantu.html | 会员专属 |
| 概念轨迹 | /gngj.html | 会员专属 |

### 2.3 更多功能下拉菜单

| 功能 | URL | 说明 |
|------|-----|------|
| 涨停时间表 | /limit-up-times.html | Hot |
| 最高涨停 | /zgtd.html | - |
| 龙虎榜全览 | /lhbfp.html | - |
| 成交额日线图 | /amo.html | 大盘成交金额日线图 |
| 历史妖股 | /yao.html | - |
| 所有营业部 | /xiwei-all-1.html | - |
| 百强营业部 | /yyb_all_pm.html | - |
| 游资购买金额排序 | /tuan-all.html | - |
| 知名游资席位大全 | /youzidaquan.html | - |

### 2.4 URL路由模式

```
/index-{YYYYMMDD}.html     # 按日期查看历史数据
/gupiao-{code}.html        # 个股详情页
/hangqing-{code}.html      # 行情详情页
/lhbd-{id}.html            # 龙虎榜详情
```

---

## 3. 公开功能（首页）

首页展示了大量实时数据，是网站的核心功能区域。

### 3.1 顶部信息栏

```html
<div id="clock" data-server-epoch-ms="..." data-time-zone="Asia/Shanghai">
  当前时间：2026-04-02 21:54:45 星期四休市中
</div>
```

功能：
- 显示当前时间（A股休市/交易状态）
- 自动根据服务器时间戳校准
- 显示交易状态（交易中/休市中）

### 3.2 涨停雁阵图

**位置**：首页核心区域

**数据结构**：
```
┌────────┬─────────┬─────────────────────────────┐
│ 进度   │ 机率    │ 2026-04-02 涨停连板雁阵图   │
├────────┼─────────┼─────────────────────────────┤
│ 4进5   │ 1/1=100%│ [股票1] [股票2] ...        │
│ 2进3   │ 3/4=75% │ [股票1] [股票2] ...        │
│ 1进2   │ 2/53=4% │ [股票1] [股票2] ...        │
└────────┴─────────┴─────────────────────────────┘
```

**字段说明**：
| 字段 | 说明 | 示例 |
|------|------|------|
| 进度 | 连板阶段 | 1进2, 2进3, 3进4, 4进5 |
| 机率 | 成功数/总数=成功率 | 2/53=4% |
| 股票列表 | 该阶段涨停的股票卡片 | - |

### 3.3 涨停股票池

**更新时间**：交易时间段每3分钟更新

**表格字段**：
| 字段 | 说明 | 数据格式 |
|------|------|----------|
| 代码 | 股票代码 | 000950 |
| 名称 | 股票名称 | 中央商场 |
| 涨幅 | 今日涨幅 | 10.00% |
| 封板资金(万) | 封住涨停板的资金 | 8894 |
| 首次封板 | 首次涨停时间 | 09:25:00 |
| 最后封板 | 最后涨停时间 | 09:25:00 |
| 炸板次数 | 打开涨停板次数 | 0 |
| 涨停统计 | 涨停成功/尝试 | 1/1 |
| 连板数 | 连续涨停板数 | 1 |
| 行业 | 所属概念/行业 | 创新药+回购+连锁药房 |

**交互功能**：
- 点击表头可排序
- 行业标签可点击高亮同名概念

### 3.4 市场总览

**表格字段**：
| 类型 | 说明 |
|------|------|
| 一字板 | 开盘即涨停，全天未打开 |
| T字板 | 打开涨停又封回 |
| 天地板 | 从涨停到跌停 |

### 3.5 概念板块涨停详情

**更新时间**：每2分钟更新

**表格字段**：
| 字段 | 说明 |
|------|------|
| 概念名称 | 可高亮的行业标签 |
| 股票详情 | 关联的涨停股票列表 |

**交互**：
- 点击概念名可高亮所有同名行业
- 支持键盘操作（Enter/Space）

### 3.6 情绪周期曲线图

**技术实现**：ECharts 堆叠柱状图

**数据范围**：从2024-10-10至今

**X轴**：日期（工作日）

**Y轴**：涨停股票数量

**系列分组**：
| 系列 | 说明 |
|------|------|
| 2 | 二连板股票数量 |
| 3 | 三连板股票数量 |
| 4 | 四连板股票数量 |
| 5+ | 五连板及以上数量 |

**特点**：
- 数值越低表示连板氛围越差
- 可点击仅查看特定板数

---

## 4. 会员专属功能

### 4.1 会员定价

| 项目 | 价格 |
|------|------|
| 数据会员 | 1200元/年 |
| 权益 | 所有会员专属内容 |

### 4.2 会员专属页面

#### 龙虎榜分析 (/lhb.html)
- 机构/游资买卖数据
- 营业部排行榜
- 知名游资席位跟踪
- 龙虎榜复盘

#### 股票人气榜 (/gupiaorenqipaihangbang.html)
- 市场人气排名
- 个股关注度指标

#### 首板反馈 (/sbsq.html)
- 首板神器
- 首板股池
- 竞价排序功能

#### 情绪周期 (/shichangqingxuzhouqiquxiantu.html)
- 市场情绪曲线
- 连板氛围指标
- 冰点感知

#### 概念轨迹 (/gngj.html)
- 概念历史涨跌
- 板块轮动追踪
- 概念下涨停股票明细

### 4.3 高级分析功能

| 功能 | 说明 |
|------|------|
| 区间涨幅 | 不同时间段的股票涨跌幅排行 |
| 最高涨停 | 连续涨停最多的股票 |
| 历史妖股 | 历史妖股回顾 |
| 营业部分析 | 游资营业部买卖排名 |

---

## 5. 技术架构

### 5.1 前端技术栈

| 技术 | 用途 |
|------|------|
| Bootstrap 5.3 | CSS框架/响应式布局 |
| ECharts | 图表渲染 |
| jQuery | DOM操作（部分） |
| Bootstrap Table | 表格增强 |
| Bootstrap Icons | 图标库 |

### 5.2 静态资源

```
/build/static/css/bootstrap-icons.min.css
/build/static/js/jquery.min.js
/build/static/js/bootstrap.bundle.js
/build/static/js/bootstrap-table.min.js
/build/static/js/echarts.min.js
```

### 5.3 数据更新机制

| 数据类型 | 更新频率 |
|----------|----------|
| 涨停时间表 | 每2分钟 |
| 涨停股票池 | 每3分钟 |
| 市场总览 | 实时 |
| 概念详情 | 每2分钟 |

### 5.4 数据存储方式

数据主要通过以下方式提供：
1. **HTML嵌入**：图表数据硬编码在页面JS中
2. **服务端渲染**：页面内容在服务器端生成
3. **客户端渲染**：部分交互数据通过AJAX获取

---

## 6. 数据结构与字段

### 6.1 涨停连板雁阵图数据

```typescript
interface LimitUpFormation {
  stage: string;      // 如 "1进2", "2进3", "3进4", "4进5"
  successCount: number; // 成功数
  totalCount: number;  // 总数
  successRate: string; // 如 "4%"
  stocks: StockCard[]; // 该阶段涨停股票
}

interface StockCard {
  code: string;       // 股票代码
  name: string;        // 股票名称
  change: string;      // 涨幅
  reason: string;      // 涨停原因/行业
  time: string;        // 封板时间
}
```

### 6.2 涨停股票池数据

```typescript
interface LimitUpStock {
  code: string;           // 代码
  name: string;            // 名称
  change: string;         // 涨幅
  sealFunds: number;       // 封板资金(万)
  firstSealTime: string;    // 首次封板时间
  lastSealTime: string;     // 最后封板时间
  breakCount: number;       // 炸板次数
  sealStats: string;       // 涨停统计 "1/1"
  continuousDays: number;   // 连板数
  industry: string;         // 行业标签
}
```

### 6.3 市场总览数据

```typescript
interface MarketOverview {
  type: string;       // 一字板/T字板/天地板
  stocks: StockCard[]; // 该类型股票列表
}
```

### 6.4 情绪周期数据

```typescript
interface SentimentData {
  date: string;       // 日期
  data: {
    level2: number;   // 二连板数量
    level3: number;   // 三连板数量
    level4: number;   // 四连板数量
    level5Plus: number; // 五连板及以上数量
  };
}
```

---

## 7. UI组件设计

### 7.1 卡片组件

```html
<div class="card h-100 dbk-card">
  <div class="card-body dbk-body">
    <!-- 内容 -->
  </div>
</div>
```

### 7.2 表格组件

```html
<table class="table table-bordered table-hover">
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>数据1</td>
      <td>数据2</td>
    </tr>
  </tbody>
</table>
```

### 7.3 行业标签组件

```html
<span
  class="d-inline-block industry-name fw-bold"
  tabindex="0"
  role="button"
  aria-label="高亮同名行业：创新药"
>
  创新药
</span>
```

**交互**：
- 点击：高亮所有同名行业
- 键盘：Enter 或 Space 可触发
- 高亮样式：背景色变化

### 7.4 股票链接组件

```html
<a href="/gupiao-600488.html" class="stock-link">
  <span class="d-inline-block text-width-60">
    股票名称
  </span>
</a>
```

### 7.5 导航栏设计

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-xxl">
    <a class="navbar-brand">
      <span class="brand-dot"></span>
      <span>打板客网</span>
    </a>
    <!-- 导航项 -->
    <ul class="navbar-nav me-auto">
      <li class="nav-item">
        <a class="nav-link text-red fw-semibold">功能名</a>
      </li>
    </ul>
    <!-- 登录按钮 -->
    <ul class="navbar-nav ms-auto">
      <li class="nav-item">
        <a class="nav-link">登录</a>
      </li>
    </ul>
  </div>
</nav>
```

### 7.6 下拉菜单组件

```html
<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" id="moreDropdown" role="button" data-bs-toggle="dropdown">
    <i class="bi bi-grid-3x3-gap"></i>
    更多功能
  </a>
  <ul class="dropdown-menu more-menu">
    <li>
      <a class="dropdown-item text-red" href="...">
        <i class="bi bi-clock-history"></i>
        <span class="flex-grow-1">涨停时间表</span>
        <span class="badge text-bg-danger">Hot</span>
      </a>
    </li>
  </ul>
</li>
```

### 7.7 样式变量

```css
:root {
  --bs-body-color-rgb: 33, 37, 41;
  --bs-tertiary-bg: #f8f9fa;
  --bs-secondary-bg: #e9ecef;
}

.text-red {
  color: #dc3545;
}

.red-text {
  color: #dc3545;
}
```

---

## 8. 商业模式

### 8.1 收入来源

| 收入来源 | 价格 | 说明 |
|----------|------|------|
| 数据会员 | 1200元/年 | 访问会员专属内容 |
| 交易系统 | 680元/套 | 打板客网交易系统1.86版 |

### 8.2 产品体系

#### 打板客网交易系统 1.86 版

**平台**：通达信插件

**功能定位**：看盘、复盘、归纳

**版本更新历史**：
- 1.86：新增「冰点感知」版面
- 1.85：A31版面集成大模型能力入口
- 1.82：新增"看盘003"版面
- 1.80：开源26个公式源码

**版面类型**：
| 版面编号 | 说明 |
|----------|------|
| A01-A31 | 各类看盘版面 |
| C01 | 连板看盘 |
| A25 | 竞价排序 |
| A30 | 连板天梯 |
| A31 | 大模型入口 |
| B01-Bxx | 其他功能版面 |

### 8.3 推广合作

- 证券公司开户推广
- 广告/推广信息页面标注
- 合作推广/广告以页面标注为准

---

## 9. 参考功能清单

以下功能可作为官网开发的参考：

### 9.1 核心功能映射

| 打板客功能 | 官网对应Tab | 说明 |
|------------|-------------|------|
| 涨停雁阵图 | signals | 涨停连板进度展示 |
| 涨停股票池 | limit-up | 涨停股票列表 |
| 市场总览 | limit-up | 一字板/T字板/天地板 |
| 概念涨停详情 | sector | 概念下涨停股票 |
| 情绪周期 | signals | 市场情绪曲线 |
| 区间涨幅 | backtest | 不同时间段涨幅排行 |
| 龙虎榜分析 | 待开发 | 会员专属 |
| 首板反馈 | 待开发 | 会员专属 |
| 概念轨迹 | sector | 概念板块涨跌 |

### 9.2 数据字段参考

```typescript
// 涨停雁阵数据
interface FormationStage {
  stage: string;        // "1进2", "2进3", "3进4", "4进5"
  successRate: string;   // "4%", "75%", "100%"
  stocks: Stock[];
}

// 涨停股票
interface LimitUpStock {
  code: string;
  name: string;
  price: string;
  change: string;        // "+10.00%"
  sealFunds: string;     // "8894" (万)
  firstSealTime: string; // "09:25:00"
  lastSealTime: string;  // "09:25:00"
  breakCount: number;     // 0
  sealStats: string;      // "1/1"
  continuousDays: number; // 1
  industries: string[];   // ["创新药", "回购"]
}

// 概念板块
interface Sector {
  name: string;
  riseCount: number;
  fallCount: number;
  leadStock: Stock;
  change: string;
}

// 情绪数据
interface SentimentData {
  date: string;
  level2: number;
  level3: number;
  level4: number;
  level5Plus: number;
}
```

### 9.3 UI参考

#### 涨停雁阵图UI
```
┌─────────────────────────────────────────────────────────┐
│  进度   │  机率   │        2026-04-02 涨停连板雁阵图     │
├─────────┼─────────┼─────────────────────────────────────┤
│ 4进5    │ 1/1=100%│ [股票] [股票]                        │
│ 2进3    │ 3/4=75% │ [股票] [股票] [股票]                 │
│ 1进2    │ 2/53=4% │ [股票] [股票] [股票] [股票] ...     │
└─────────┴─────────┴─────────────────────────────────────┘
```

#### 涨停股票池UI
```
┌──────┬──────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ 代码 │ 名称  │ 涨幅   │ 封板资金│首次封板│最后封板│炸板次数│涨停统计│ 连板数  │ 行业      │
├──────┼──────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│000950│中央商场│+10.00%│  8894  │09:25:00│09:25:00│   0    │  1/1   │   1    │创新药+回购│
└──────┴──────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```

### 9.4 行业高亮交互

```javascript
// 高亮行业/概念名（事件委托 + 键盘可访问）
document.addEventListener('DOMContentLoaded', function() {
  var industrySelector = '.industry-name';

  var highlightIndustry = function(name) {
    if (!name) return;
    document.querySelectorAll(industrySelector).forEach(function(span) {
      span.classList.toggle('highlight',
        normalizeText(span.textContent) === name);
    });
  };

  // 点击高亮
  document.addEventListener('click', function(event) {
    var target = event.target.closest(industrySelector);
    if (!target) return;
    highlightIndustry(normalizeText(target.textContent));
  });

  // 键盘高亮
  document.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var target = event.target.closest(industrySelector);
    if (!target) return;
    event.preventDefault();
    highlightIndustry(normalizeText(target.textContent));
  });
});
```

### 9.5 ECharts情绪曲线配置

```javascript
var option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ["2024-10-10", "2024-10-11", ...]
  }],
  yAxis: [{
    type: 'value'
  }],
  series: [
    {
      name: '2',
      type: 'bar',
      stack: '总量',
      emphasis: {
        focus: 'series'
      },
      data: [6, 6, 8, 17, ...]
    },
    {
      name: '3',
      type: 'bar',
      stack: '总量',
      emphasis: {
        focus: 'series'
      },
      data: [0, 1, 1, 3, ...]
    }
    // ...
  ]
};
```

---

## 附录

### A. 截图文件

| 文件 | 说明 |
|------|------|
| /tmp/dabanke_home.png | 首页截图 |
| /tmp/dabanke_qjzf.png | 区间涨幅页面 |
| /tmp/dabanke_lhb.png | 龙虎榜分析页面 |
| /tmp/dabanke_renqi.png | 股票人气榜页面 |
| /tmp/dabanke_qx.png | 情绪周期页面 |
| /tmp/dabanke_limit_times.png | 涨停时间表页面 |
| /tmp/dabanke_gngj.png | 概念轨迹页面 |
| /tmp/dabanke_product.png | 交易系统产品页 |

### B. 相关链接

- 打板客网：https://dabanke.com/
- 数据会员：1200元/年
- 交易系统：680元/套
