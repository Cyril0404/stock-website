"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Bell, Users, Star, ArrowUpRight, ArrowDownRight, Zap, BarChart3, Calendar, Building2, Calculator, ChevronRight, Search, Settings, LogOut, User, Sun, Moon, Volume2, VolumeX, Heart, Globe, Wallet, BellOff, Sparkles, Grid3x3, LineChart, Filter, Activity, Scale, Droplet, Gem, Flame, Target, Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock User
const mockUser = {
  name: "神冢",
  email: "shenzhong@example.com",
  avatar: null,
}

// Mock Data - 全部股票
const allStocks = [
  { code: "600036", name: "招商银行", price: "38.56", change: "+1.23%", volume: "45.6M", type: "银行" },
  { code: "000858", name: "五粮液", price: "156.78", change: "-0.56%", volume: "23.1M", type: "白酒" },
  { code: "601318", name: "中国平安", price: "48.90", change: "+2.34%", volume: "67.8M", type: "保险" },
  { code: "600519", name: "贵州茅台", price: "1688.00", change: "+0.89%", volume: "12.3M", type: "白酒" },
  { code: "000001", name: "平安银行", price: "12.34", change: "-1.23%", volume: "34.5M", type: "银行" },
  { code: "601888", name: "中国中免", price: "78.90", change: "+3.45%", volume: "28.9M", type: "旅游" },
  { code: "002475", name: "立讯精密", price: "32.15", change: "-2.11%", volume: "56.7M", type: "消费电子" },
  { code: "300750", name: "宁德时代", price: "189.50", change: "+1.78%", volume: "41.2M", type: "新能源" },
  { code: "688599", name: "天合光能", price: "23.45", change: "+5.67%", volume: "89.3M", type: "光伏" },
  { code: "600900", name: "长江电力", price: "28.90", change: "+0.45%", volume: "15.6M", type: "电力" },
]

// Mock Data - 涨停板
const limitUpStocks = [
  { code: "001359", name: "N团结", price: "45.67", change: "+19.97%", volume: "12.3M", reason: "新股上市", time: "09:30" },
  { code: "301528", name: "多浦乐", price: "78.90", change: "+19.99%", volume: "8.7M", reason: "军工概念", time: "09:30" },
  { code: "002951", name: "金凯生科", price: "56.23", change: "+10.01%", volume: "15.2M", reason: "医药中间体", time: "09:35" },
  { code: "688582", name: "芯动联科", price: "89.45", change: "+20.00%", volume: "6.5M", reason: "半导体", time: "09:42" },
  { code: "300917", name: "特发服务", price: "34.56", change: "+9.98%", volume: "21.8M", reason: "物业服务", time: "10:05" },
  { code: "002796", name: "世嘉科技", price: "12.34", change: "+10.02%", volume: "45.6M", reason: "5G概念", time: "10:15" },
  { code: "600518", name: "ST康美", price: "2.15", change: "+5.00%", volume: "156M", reason: "债务重组", time: "10:30" },
]

// Mock Data - 跌停板
const limitDownStocks = [
  { code: "300338", name: "开元教育", price: "5.67", change: "-20.01%", volume: "32.1M", reason: "业绩预亏", time: "09:30" },
  { code: "002716", name: "金贵银业", price: "3.45", change: "-10.05%", volume: "28.9M", reason: "风险警示", time: "09:30" },
  { code: "688399", name: "硕世生物", price: "67.89", change: "-19.99%", volume: "4.2M", reason: "核酸检测回落", time: "09:45" },
  { code: "002366", name: "台海核电", price: "4.23", change: "-10.00%", volume: "18.7M", reason: "债务危机", time: "10:20" },
]

// Mock Data - AI早报
const morningNews = [
  { title: "央行宣布定向降准0.25个百分点", summary: "支持实体经济发展，释放长期资金约5000亿元", sentiment: "利好", time: "07:30" },
  { title: "美股三大指数集体收涨", summary: "道指涨0.56%，纳指涨1.53%，标普500涨0.74%", sentiment: "中性", time: "06:00" },
  { title: "A股成交额突破1.2万亿", summary: "市场活跃度明显提升，北向资金净流入86亿", sentiment: "利好", time: "08:00" },
  { title: "科技股领涨两市", summary: "半导体、人工智能板块涨幅居前，多股涨停", sentiment: "利好", time: "09:15" },
]

// Mock Data - 我的持仓
const myHoldings = [
  { code: "600519", name: "贵州茅台", volume: 100, cost: 1650.00, current: 1688.00 },
  { code: "300750", name: "宁德时代", volume: 200, cost: 180.50, current: 189.50 },
  { code: "601318", name: "中国平安", volume: 500, cost: 46.00, current: 48.90 },
]

// Mock Data - 自选股
const myFavorites = [
  { code: "600036", name: "招商银行" },
  { code: "000858", name: "五粮液" },
  { code: "688599", name: "天合光能" },
]

// Mock Data - 券商
const brokers = [
  { name: "华泰证券", feature: "头部券商", commission: "万1.5", wealth: "有", vip: "专属投顾", highlight: "ETF免五" },
  { name: "银河证券", feature: "国有券商", commission: "万1.3", wealth: "有", vip: "投顾服务", highlight: "Level2" },
  { name: "国金证券", feature: "互联网券商", commission: "万1.0", wealth: "有", vip: "量化交易", highlight: "同花顺" },
  { name: "华宝证券", feature: "特色券商", commission: "万0.9", wealth: "有", vip: "网格交易", highlight: "智能条件单" },
]

// Mock Data - 炸板股
const brokenLimitUpStocks = [
  { code: "002946", name: "新乳业", price: "18.56", change: "+6.78%", reason: "食品饮料", time: "10:32", breakCount: 2 },
  { code: "300999", name: "金龙鱼", price: "32.45", change: "+8.92%", reason: "消费食品", time: "13:15", breakCount: 1 },
  { code: "600887", name: "伊利股份", price: "28.90", change: "+5.34%", reason: "乳业", time: "14:22", breakCount: 3 },
]

// Mock Data - 概念板块
const sectorData = [
  { sector: "商业航天", riseCount: 12, fallCount: 3, leadStock: "神剑股份", change: "+5.67%" },
  { sector: "创新药", riseCount: 18, fallCount: 5, leadStock: "凯莱英", change: "+4.32%" },
  { sector: "机器人概念", riseCount: 15, fallCount: 8, leadStock: "特发信息", change: "+3.89%" },
  { sector: "风电", riseCount: 9, fallCount: 4, leadStock: "新能泰山", change: "+3.21%" },
  { sector: "AI智能体", riseCount: 8, fallCount: 6, leadStock: "泛微网络", change: "+2.95%" },
  { sector: "新能源汽车", riseCount: 22, fallCount: 12, leadStock: "宁德时代", change: "+2.45%" },
  { sector: "半导体", riseCount: 14, fallCount: 9, leadStock: "芯动联科", change: "+1.87%" },
  { sector: "医疗器械", riseCount: 7, fallCount: 11, leadStock: "万邦德", change: "-0.54%" },
]

// Mock Data - 涨停雁阵（连板进度）
const limitUpFormationData = [
  {
    stage: "4进5",
    successRate: "0%",
    success: 0,
    total: 1,
    stocks: [
      { code: "002361", name: "神剑股份", change: "+10.00%", reason: "商业航天", status: "败", statusColor: "text-green-500" },
    ]
  },
  {
    stage: "3进4",
    successRate: "50%",
    success: 1,
    total: 2,
    stocks: [
      { code: "002361", name: "神剑股份", change: "+10.00%", reason: "商业航天", status: "成", statusColor: "text-red-500" },
      { code: "603920", name: "联翔股份", change: "-7.17%", reason: "家居用品", status: "败", statusColor: "text-green-500" },
    ]
  },
  {
    stage: "2进3",
    successRate: "9%",
    success: 1,
    total: 11,
    stocks: [
      { code: "600488", name: "津药药业", change: "+10.08%", reason: "创新药", status: "成", statusColor: "text-red-500" },
      { code: "603618", name: "杭电股份", change: "+6.66%", reason: "电网设备", status: "炸", statusColor: "text-orange-500" },
      { code: "002038", name: "双鹭药业", change: "+4.40%", reason: "创新药", status: "败", statusColor: "text-green-500" },
      { code: "002280", name: "法尔胜", change: "+4.05%", reason: "光纤概念", status: "败", statusColor: "text-green-500" },
    ]
  },
  {
    stage: "1进2",
    successRate: "13%",
    success: 6,
    total: 48,
    stocks: [
      { code: "301208", name: "宏昌科技", change: "+20.01%", reason: "参股张雪机车", status: "成", statusColor: "text-red-500" },
      { code: "000008", name: "神州高铁", change: "+10.10%", reason: "机器人概念", status: "成", statusColor: "text-red-500" },
      { code: "002478", name: "闽发铝业", change: "+10.09%", reason: "有色铝", status: "成", statusColor: "text-red-500" },
      { code: "688677", name: "海泰新光", change: "+14.34%", reason: "医疗器械", status: "炸", statusColor: "text-orange-500" },
    ]
  },
]

// Mock Data - 宏观指标
const macroIndicators = [
  { name: "巴菲特指标", value: "118.5%", change: "+2.3%", description: "股市/GDP比是否过热", icon: "BarChart", status: "过热" },
  { name: "股债利差", value: "2.85%", change: "+0.15%", description: "股票相对债券吸引力", icon: "Scale", status: "正常" },
  { name: "铜油比", value: "0.085", change: "-1.2%", description: "工业景气度与通胀预期", icon: "Droplet", status: "正常" },
  { name: "金银比", value: "78.5", change: "+0.8%", description: "贵金属相对价值", icon: "Gem", status: "正常" },
  { name: "存款市值比", value: "65.2%", change: "+3.5%", description: "居民资金入市情况", icon: "Wallet", status: "偏高" },
  { name: "成交额M2比", value: "8.5%", change: "+0.9%", description: "市场交易活跃度", icon: "Activity", status: "活跃" },
]

// Mock Data - 多因子选股筛选条件
const screenerFilters = {
  industry: "",
  area: "",
  market: "",
  peMin: "", peMax: "",
  pbMin: "", pbMax: "",
  psMin: "", psMax: "",
  dividendMin: "",
  marketCapMin: "", marketCapMax: "",
  turnoverMin: "", turnoverMax: "",
  rsiMin: "", rsiMax: "",
}

// Mock Data - 选股结果
const screenerResults = [
  { rank: 1, code: "600036", name: "招商银行", score: 85.6, pe: 8.2, pb: 1.2, roe: 16.8, turnover: 2.3 },
  { rank: 2, code: "601318", name: "中国平安", score: 82.3, pe: 9.5, pb: 1.5, roe: 14.2, turnover: 3.1 },
  { rank: 3, code: "600519", name: "贵州茅台", score: 78.9, pe: 32.5, pb: 12.8, roe: 28.5, turnover: 0.8 },
  { rank: 4, code: "300750", name: "宁德时代", score: 75.2, pe: 22.3, pb: 5.6, roe: 18.9, turnover: 4.2 },
  { rank: 5, code: "688599", name: "天合光能", score: 71.8, pe: 15.8, pb: 3.2, roe: 12.5, turnover: 6.8 },
]

// Mock Data - 回测结果
const backtestResult = {
  totalReturn: "+128.5%",
  annualizedReturn: "+25.7%",
  sharpeRatio: "1.85",
  maxDrawdown: "-18.3%",
  winRate: "62.5%",
  totalTrades: 156,
  profitLossRatio: "1.73",
}

// Mock Data - 情绪周期
const sentimentData = {
  today: "偏热",
  score: 72,
  trend: "上升",
  description: "连板氛围较好，短线资金活跃",
}

// Stock Row Component
function StockRow({ stock, showType = false, showVolume = true }: { stock: { code: string, name: string, price: string, change: string, volume: string, type?: string, reason?: string, time?: string }, showType?: boolean, showVolume?: boolean }) {
  const isUp = stock.change.startsWith("+")
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer">
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        isUp ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
      )}>
        {isUp ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{stock.name}</span>
          <span className="font-mono text-sm text-muted-foreground">{stock.code}</span>
        </div>
        {showType && <p className="text-sm text-muted-foreground">{stock.type}</p>}
      </div>
      <div className="text-right">
        <p className="font-mono font-semibold">{stock.price}</p>
        <p className={cn(
          "font-mono text-sm font-medium",
          isUp ? "text-red-500" : "text-green-500"
        )}>
          {stock.change}
        </p>
      </div>
      {showVolume && (
        <div className="hidden text-right md:block">
          <p className="font-mono text-sm text-muted-foreground">{stock.volume}</p>
        </div>
      )}
    </div>
  )
}

// Holdings Row Component
function HoldingsRow({ holding }: { holding: typeof myHoldings[0] }) {
  const profit = (holding.current - holding.cost) * holding.volume
  const profitRate = ((holding.current - holding.cost) / holding.cost * 100).toFixed(2)
  const isProfit = profit >= 0

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{holding.name}</span>
          <span className="font-mono text-sm text-muted-foreground">{holding.code}</span>
        </div>
        <p className="text-sm text-muted-foreground">持仓 {holding.volume} 股</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-muted-foreground">现价 ¥{holding.current}</p>
        <p className="font-mono text-sm text-muted-foreground">成本 ¥{holding.cost}</p>
      </div>
      <div className="text-right">
        <p className={cn("font-mono font-semibold", isProfit ? "text-red-500" : "text-green-500")}>
          {isProfit ? "+" : ""}¥{profit.toFixed(2)}
        </p>
        <p className={cn("font-mono text-sm font-medium", isProfit ? "text-red-500" : "text-green-500")}>
          {isProfit ? "+" : ""}{profitRate}%
        </p>
      </div>
    </div>
  )
}

// News Card Component
function NewsCard({ news }: { news: typeof morningNews[0] }) {
  const sentimentColor = news.sentiment === "利好" ? "text-red-500 bg-red-500/10" : news.sentiment === "利空" ? "text-green-500 bg-green-500/10" : "text-gray-500 bg-gray-500/10"
  return (
    <div className="rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight">{news.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{news.summary}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2 py-1 text-xs font-medium", sentimentColor)}>
          {news.sentiment}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          {news.time}
        </span>
      </div>
    </div>
  )
}

// Broker Card Component
function BrokerCard({ broker, onSelect }: { broker: typeof brokers[0], onSelect: () => void }) {
  return (
    <div className="rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{broker.name}</h3>
          <p className="text-sm text-muted-foreground">{broker.feature}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {broker.highlight}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">佣金</p>
          <p className="font-mono text-lg font-semibold text-primary">{broker.commission}</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">投顾服务</p>
          <p className="text-sm font-medium">{broker.vip}</p>
        </div>
      </div>
      <Button className="mt-4 w-full" onClick={onSelect}>
        <Calculator className="mr-2 h-4 w-4" />
        计算佣金
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// Login Modal Component
function LoginModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = () => {
    // Mock login
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "注册账户" : "登录"}</DialogTitle>
          <DialogDescription>
            {isSignUp ? "创建新账户，开始您的投资之旅" : "登录您的股票助手账户"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium">昵称</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您的昵称"
                className="mt-1"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">邮箱</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {isSignUp ? "注册" : "登录"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                已有账户？{" "}
                <button className="text-primary hover:underline" onClick={() => setIsSignUp(false)}>
                  登录
                </button>
              </>
            ) : (
              <>
                没有账户？{" "}
                <button className="text-primary hover:underline" onClick={() => setIsSignUp(true)}>
                  注册
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Commission Calculator Dialog
function CommissionCalculator({ broker, open, onClose }: { broker: typeof brokers[0] | null, open: boolean, onClose: () => void }) {
  const [amount, setAmount] = useState("100000")
  const [frequency, setFrequency] = useState("10")

  const commission = broker ? (parseFloat(amount) * parseFloat(broker.commission.replace("万", "")) / 10000 * parseInt(frequency)).toFixed(2) : "0.00"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>佣金计算器 - {broker?.name}</DialogTitle>
          <DialogDescription>计算您的年度交易佣金成本</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">单笔交易金额（元）</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium">每月交易次数</label>
            <Input
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 font-mono"
            />
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">年度佣金成本</p>
            <p className="font-mono text-3xl font-bold text-primary">¥{commission}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>关闭</Button>
          <Button onClick={onClose}>立即开户</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Settings Modal
function SettingsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>自定义您的股票助手体验</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">深色模式</p>
                <p className="text-sm text-muted-foreground">切换明暗主题</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">消息通知</p>
                <p className="text-sm text-muted-foreground">涨跌停提醒</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setNotifications(!notifications)}>
              {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {sound ? <Volume2 className="h-5 w-5 text-muted-foreground" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
              <div>
                <p className="font-medium">声音</p>
                <p className="text-sm text-muted-foreground">操作音效</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSound(!sound)}>
              {sound ? "开" : "关"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Page
export default function StockWebsite() {
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedBroker, setSelectedBroker] = useState<typeof brokers[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [stockType, setStockType] = useState("all")

  // API Data State
  const [apiIndices, setApiIndices] = useState<Array<{code: string, name: string, price: string, change: string, changePercent: string, volume: string, amount: string, amplitude: string, high: string, low: string, open: string}>>([])
  const [apiLimitUp, setApiLimitUp] = useState<typeof limitUpStocks>([])
  const [apiLimitDown, setApiLimitDown] = useState<typeof limitDownStocks>([])
  const [apiOverview, setApiOverview] = useState<any>(null)

  // Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, indicesRes, limitUpRes, limitDownRes] = await Promise.all([
          fetch('/api/overview'),
          fetch('/api/indices'),
          fetch('/api/limit_up'),
          fetch('/api/limit_down'),
        ])
        const overviewData = await overviewRes.json()
        const indicesData = await indicesRes.json()
        const limitUpData = await limitUpRes.json()
        const limitDownData = await limitDownRes.json()

        if (overviewData.success) setApiOverview(overviewData.data)
        if (indicesData.success) setApiIndices(indicesData.data)
        if (limitUpData.success) setApiLimitUp(limitUpData.data)
        if (limitDownData.success) setApiLimitDown(limitDownData.data)
      } catch (error) {
        console.error('Failed to fetch API data:', error)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleSelectBroker = (broker: typeof brokers[0]) => {
    setSelectedBroker(broker)
    setCalculatorOpen(true)
  }

  const handleLogin = () => {
    setUser(mockUser)
    setLoginOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const filteredStocks = allStocks.filter(stock => {
    const matchesSearch = stock.name.includes(searchQuery) || stock.code.includes(searchQuery)
    const matchesType = stockType === "all" || stock.type === stockType
    return matchesSearch && matchesType
  })

  const totalProfit = myHoldings.reduce((acc, h) => acc + (h.current - h.cost) * h.volume, 0)
  const totalProfitRate = (totalProfit / myHoldings.reduce((acc, h) => acc + h.cost * h.volume, 0) * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div>
              <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                今日A股
              </h1>
              <p className="text-xs text-muted-foreground">股票助手</p>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索股票代码或名称..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {}}>
                        <User className="mr-2 h-4 w-4" />
                        个人资料
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Wallet className="mr-2 h-4 w-4" />
                        我的持仓
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Heart className="mr-2 h-4 w-4" />
                        自选股
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        退出登录
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => setLoginOpen(true)}>
                  登录
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Market Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {apiIndices[0]?.name || '上证指数'}
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">{apiIndices[0]?.price || '3,286.65'}</p>
            <p className={`flex items-center gap-1 text-sm font-medium ${parseFloat(apiIndices[0]?.changePercent || '0') >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {parseFloat(apiIndices[0]?.changePercent || '0') >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {apiIndices[0]?.changePercent || '+1.23'}%
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {apiIndices[1]?.name || '深证成指'}
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">{apiIndices[1]?.price || '10,892.34'}</p>
            <p className={`flex items-center gap-1 text-sm font-medium ${parseFloat(apiIndices[1]?.changePercent || '0') >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {parseFloat(apiIndices[1]?.changePercent || '0') >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {apiIndices[1]?.changePercent || '+1.85'}%
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              成交额
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">{apiIndices[0]?.volume || '1.23万亿'}</p>
            <p className="flex items-center gap-1 text-sm font-medium text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +15.6%
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              涨跌停
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">{apiOverview?.limitUpCount || 87} / {apiOverview?.limitDownCount || 12}</p>
            <p className="text-sm text-muted-foreground">涨停/跌停</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="market" className="animate-fade-in-up">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="market" className="gap-2">
              <Globe className="h-4 w-4" />
              市场
            </TabsTrigger>
            <TabsTrigger value="limit" className="gap-2">
              <Zap className="h-4 w-4" />
              涨跌停
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Bell className="h-4 w-4" />
              AI早报
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Wallet className="h-4 w-4" />
              持仓
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              自选
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Building2 className="h-4 w-4" />
              开户
            </TabsTrigger>
            <TabsTrigger value="signals" className="gap-2">
              <Sparkles className="h-4 w-4" />
              涨停雁阵
            </TabsTrigger>
            <TabsTrigger value="sector" className="gap-2">
              <Grid3x3 className="h-4 w-4" />
              概念
            </TabsTrigger>
            <TabsTrigger value="macro" className="gap-2">
              <Activity className="h-4 w-4" />
              宏观
            </TabsTrigger>
            <TabsTrigger value="screener" className="gap-2">
              <Filter className="h-4 w-4" />
              选股
            </TabsTrigger>
            <TabsTrigger value="backtest" className="gap-2">
              <LineChart className="h-4 w-4" />
              回测
            </TabsTrigger>
          </TabsList>

          {/* 市场 Tab */}
          <TabsContent value="market">
            <div className="mb-4 flex items-center gap-4 flex-wrap">
              <Select value={stockType} onValueChange={setStockType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="板块" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部板块</SelectItem>
                  <SelectItem value="银行">银行</SelectItem>
                  <SelectItem value="白酒">白酒</SelectItem>
                  <SelectItem value="保险">保险</SelectItem>
                  <SelectItem value="旅游">旅游</SelectItem>
                  <SelectItem value="消费电子">消费电子</SelectItem>
                  <SelectItem value="新能源">新能源</SelectItem>
                  <SelectItem value="光伏">光伏</SelectItem>
                  <SelectItem value="电力">电力</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {filteredStocks.map((stock) => (
                <StockRow key={stock.code} stock={stock} showType />
              ))}
            </div>
          </TabsContent>

          {/* 涨跌停 Tab */}
          <TabsContent value="limit">
            <div className="space-y-8">
              {/* 涨停 */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold">涨停板</h2>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                    {apiLimitUp.length > 0 ? apiLimitUp.length : limitUpStocks.length}只
                  </span>
                </div>
                <div className="space-y-2">
                  {(apiLimitUp.length > 0 ? apiLimitUp : limitUpStocks).map((stock) => (
                    <StockRow key={stock.code} stock={stock} />
                  ))}
                </div>
              </div>

              {/* 跌停 */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-semibold">跌停板</h2>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                    {apiLimitDown.length > 0 ? apiLimitDown.length : limitDownStocks.length}只
                  </span>
                </div>
                <div className="space-y-2">
                  {(apiLimitDown.length > 0 ? apiLimitDown : limitDownStocks).map((stock) => (
                    <StockRow key={stock.code} stock={stock} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI早报 Tab */}
          <TabsContent value="news">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">今日早报</h2>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} 07:30 更新
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                订阅推送
              </Button>
            </div>
            <div className="space-y-3">
              {morningNews.map((news, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <NewsCard news={news} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 持仓 Tab */}
          <TabsContent value="portfolio">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">我的持仓</h2>
              <p className="text-sm text-muted-foreground">实时跟踪您的投资收益</p>
            </div>
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总收益</p>
                  <p className={cn("font-mono text-2xl font-bold", totalProfit >= 0 ? "text-red-500" : "text-green-500")}>
                    {totalProfit >= 0 ? "+" : ""}¥{totalProfit.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">收益率</p>
                  <p className={cn("font-mono text-2xl font-bold", parseFloat(totalProfitRate) >= 0 ? "text-red-500" : "text-green-500")}>
                    {parseFloat(totalProfitRate) >= 0 ? "+" : ""}{totalProfitRate}%
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {myHoldings.map((holding) => (
                <HoldingsRow key={holding.code} holding={holding} />
              ))}
            </div>
          </TabsContent>

          {/* 自选 Tab */}
          <TabsContent value="favorites">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">我的自选</h2>
                <p className="text-sm text-muted-foreground">关注您感兴趣的股票</p>
              </div>
              <Button variant="outline" size="sm">
                <span className="mr-2">+</span>
                添加自选
              </Button>
            </div>
            <div className="space-y-2">
              {myFavorites.map((stock) => {
                const stockData = allStocks.find(s => s.code === stock.code)
                if (!stockData) return null
                return <StockRow key={stock.code} stock={stockData} showVolume={false} />
              })}
            </div>
          </TabsContent>

          {/* 开户 Tab */}
          <TabsContent value="account">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">券商开户</h2>
              <p className="text-sm text-muted-foreground">比较各大券商佣金费率，选择最适合您的方案</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {brokers.map((broker) => (
                <BrokerCard key={broker.name} broker={broker} onSelect={() => handleSelectBroker(broker)} />
              ))}
            </div>
          </TabsContent>

          {/* 涨停雁阵 Tab */}
          <TabsContent value="signals">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">涨停连板雁阵图</h2>
              <p className="text-sm text-muted-foreground">
                <Clock className="mr-1 inline h-3 w-3" />
                交易时间段每两分钟更新
              </p>
            </div>

            {/* 情绪周期 */}
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="font-semibold">市场情绪</p>
                    <p className="text-sm text-muted-foreground">{sentimentData.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-mono text-2xl font-bold",
                    sentimentData.score > 70 ? "text-red-500" : sentimentData.score > 40 ? "text-orange-500" : "text-green-500"
                  )}>{sentimentData.today}</p>
                  <p className="text-sm text-muted-foreground">
                    热度 {sentimentData.score} {sentimentData.trend === "上升" ? <ArrowUpRight className="inline h-3 w-3 text-red-500" /> : <ArrowDownRight className="inline h-3 w-3 text-green-500" />}
                  </p>
                </div>
              </div>
            </div>

            {/* 雁阵图 */}
            <div className="space-y-6">
              {limitUpFormationData.map((stage) => (
                <div key={stage.stage} className="rounded-xl border bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{stage.stage}</h3>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        parseInt(stage.successRate) >= 50 ? "bg-red-500/10 text-red-500" :
                        parseInt(stage.successRate) >= 20 ? "bg-orange-500/10 text-orange-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {stage.successRate}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stage.success}/{stage.total}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stage.stocks.map((stock) => (
                      <div key={stock.code} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 hover:border-primary/30">
                        <div className={cn("font-mono text-sm font-semibold", stock.statusColor)}>{stock.name}</div>
                        <div className={cn("rounded px-1.5 py-0.5 text-xs font-medium", stock.statusColor === "text-red-500" ? "bg-red-500/10" : stock.statusColor === "text-orange-500" ? "bg-orange-500/10" : "bg-green-500/10")}>
                          {stock.status}
                        </div>
                        <span className="text-xs text-muted-foreground">{stock.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 概念板块 Tab */}
          <TabsContent value="sector">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">概念板块</h2>
              <p className="text-sm text-muted-foreground">按概念分类的市场涨跌情况</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {sectorData.map((sector) => (
                <div key={sector.sector} className="rounded-xl border bg-card p-4 hover:shadow-md hover:border-primary/20 cursor-pointer transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        sector.change.startsWith("+") ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                      )}>
                        <Grid3x3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{sector.sector}</h3>
                        <p className="text-sm text-muted-foreground">
                          涨{sector.riseCount} / 跌{sector.fallCount}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-mono text-lg font-semibold",
                        sector.change.startsWith("+") ? "text-red-500" : "text-green-500"
                      )}>{sector.change}</p>
                      <p className="text-xs text-muted-foreground">龙头: {sector.leadStock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 宏观指标 Tab */}
          <TabsContent value="macro">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">宏观指标</h2>
              <p className="text-sm text-muted-foreground">辅助判断市场冷热和投资情绪</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {macroIndicators.map((indicator) => (
                <div key={indicator.name} className="rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {indicator.icon === "BarChart" && <BarChart3 className="h-6 w-6 text-primary" />}
                      {indicator.icon === "Scale" && <Scale className="h-6 w-6 text-primary" />}
                      {indicator.icon === "Droplet" && <Droplet className="h-6 w-6 text-primary" />}
                      {indicator.icon === "Gem" && <Gem className="h-6 w-6 text-primary" />}
                      {indicator.icon === "Wallet" && <Wallet className="h-6 w-6 text-primary" />}
                      {indicator.icon === "Activity" && <Activity className="h-6 w-6 text-primary" />}
                      <div>
                        <h3 className="font-semibold">{indicator.name}</h3>
                        <p className="text-xs text-muted-foreground">{indicator.description}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      indicator.status === "过热" || indicator.status === "活跃" ? "bg-red-500/10 text-red-500" :
                      indicator.status === "偏高" ? "bg-orange-500/10 text-orange-500" :
                      "bg-green-500/10 text-green-500"
                    )}>
                      {indicator.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-3xl font-bold">{indicator.value}</p>
                    <p className={cn(
                      "font-mono text-sm",
                      indicator.change.startsWith("+") ? "text-red-500" : "text-green-500"
                    )}>
                      {indicator.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 补充说明 */}
            <div className="mt-6 rounded-xl border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">指标说明</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p><span className="text-red-500">●</span> 巴菲特指标 = 股市总市值 / GDP，&gt;100%表示相对高估</p>
                <p><span className="text-red-500">●</span> 股债利差 = 股票收益率 - 债券收益率，利差越大股票相对越便宜</p>
                <p><span className="text-green-500">●</span> 铜油比 = 铜价/油价，反映工业需求和通胀预期</p>
                <p><span className="text-orange-500">●</span> 金银比 &gt;80 可能预示贵金属市场转折机会</p>
              </div>
            </div>
          </TabsContent>

          {/* 多因子选股 Tab */}
          <TabsContent value="screener">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">多因子选股</h2>
              <p className="text-sm text-muted-foreground">基于多维度条件筛选优质股票</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* 筛选条件 */}
              <div className="lg:col-span-1 rounded-xl border bg-card p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  筛选条件
                </h3>

                <div className="space-y-4">
                  {/* 估值指标 */}
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium mb-3 text-primary">估值指标</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">市盈率 (PE)</label>
                        <div className="flex items-center gap-2">
                          <Input placeholder="最小" className="font-mono text-sm" />
                          <span className="text-muted-foreground">-</span>
                          <Input placeholder="最大" className="font-mono text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">市净率 (PB)</label>
                        <div className="flex items-center gap-2">
                          <Input placeholder="最小" className="font-mono text-sm" />
                          <span className="text-muted-foreground">-</span>
                          <Input placeholder="最大" className="font-mono text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 技术指标 */}
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium mb-3 text-primary">技术指标</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">换手率 (%)</label>
                        <div className="flex items-center gap-2">
                          <Input placeholder="最小" className="font-mono text-sm" />
                          <span className="text-muted-foreground">-</span>
                          <Input placeholder="最大" className="font-mono text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">RSI</label>
                        <div className="flex items-center gap-2">
                          <Input placeholder="最小" className="font-mono text-sm" />
                          <span className="text-muted-foreground">-</span>
                          <Input placeholder="最大" className="font-mono text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 市值 */}
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium mb-3 text-primary">市值 (亿)</h4>
                    <div className="flex items-center gap-2">
                      <Input placeholder="最小" className="font-mono text-sm" />
                      <span className="text-muted-foreground">-</span>
                      <Input placeholder="最大" className="font-mono text-sm" />
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    开始选股
                  </Button>
                </div>
              </div>

              {/* 选股结果 */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">选股结果</h3>
                  <span className="text-sm text-muted-foreground">共 {screenerResults.length} 只</span>
                </div>

                <div className="rounded-xl border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm">
                        <th className="p-3 font-medium">排名</th>
                        <th className="p-3 font-medium">股票</th>
                        <th className="p-3 font-medium">综合评分</th>
                        <th className="p-3 font-medium">PE</th>
                        <th className="p-3 font-medium">PB</th>
                        <th className="p-3 font-medium">ROE</th>
                        <th className="p-3 font-medium">换手率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screenerResults.map((stock) => (
                        <tr key={stock.code} className="border-t hover:bg-muted/30 cursor-pointer">
                          <td className="p-3">
                            <span className={cn(
                              "font-mono font-bold",
                              stock.rank === 1 ? "text-yellow-500" :
                              stock.rank === 2 ? "text-gray-400" :
                              stock.rank === 3 ? "text-orange-400" : ""
                            )}>#{stock.rank}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{stock.name}</span>
                              <span className="font-mono text-sm text-muted-foreground">{stock.code}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-semibold text-primary">{stock.score}</span>
                          </td>
                          <td className="p-3 font-mono text-sm">{stock.pe}</td>
                          <td className="p-3 font-mono text-sm">{stock.pb}</td>
                          <td className="p-3 font-mono text-sm text-green-500">{stock.roe}%</td>
                          <td className="p-3 font-mono text-sm">{stock.turnover}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 回测验证 Tab */}
          <TabsContent value="backtest">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">策略回测验证</h2>
              <p className="text-sm text-muted-foreground">基于历史数据验证策略有效性</p>
            </div>

            {/* 回测参数 */}
            <div className="mb-6 rounded-xl border bg-card p-4">
              <h3 className="font-semibold mb-3">回测参数</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-xs text-muted-foreground">初始资金</label>
                  <p className="font-mono font-semibold">100万</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">回测区间</label>
                  <p className="font-mono font-semibold">2023.01 - 2025.12</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">持仓周期</label>
                  <p className="font-mono font-semibold">5日</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">手续费率</label>
                  <p className="font-mono font-semibold">万3</p>
                </div>
              </div>
            </div>

            {/* 核心指标 */}
            <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">总收益率</p>
                <p className="font-mono text-2xl font-bold text-red-500">{backtestResult.totalReturn}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">年化收益</p>
                <p className="font-mono text-2xl font-bold text-red-500">{backtestResult.annualizedReturn}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">夏普比率</p>
                <p className="font-mono text-2xl font-bold text-primary">{backtestResult.sharpeRatio}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">最大回撤</p>
                <p className="font-mono text-2xl font-bold text-green-500">{backtestResult.maxDrawdown}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">胜率</p>
                <p className="font-mono text-2xl font-bold text-primary">{backtestResult.winRate}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">盈亏比</p>
                <p className="font-mono text-2xl font-bold text-primary">{backtestResult.profitLossRatio}</p>
              </div>
            </div>

            {/* 收益曲线示意 */}
            <div className="rounded-xl border bg-card p-4 mb-4">
              <h3 className="font-semibold mb-4">收益曲线</h3>
              <div className="h-48 flex items-end justify-between gap-1">
                {[12, 18, 15, 25, 22, 35, 28, 42, 38, 55, 48, 62, 58, 75, 68, 82, 78, 95, 88, 108, 95, 118, 110, 128].map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/80 rounded-t"
                    style={{ height: `${value / 1.5}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>2023-01</span>
                <span>2024-01</span>
                <span>2025-01</span>
                <span>2025-12</span>
              </div>
            </div>

            {/* 风险提示 */}
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-500">风险提示</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    回测结果仅供参考，不代表未来收益。历史表现良好不能保证未来持续盈利。
                    实盘交易需谨慎，请根据自身风险承受能力合理配置资产。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            仅供参考，不构成投资建议。股市有风险，投资需谨慎。
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <CommissionCalculator
        broker={selectedBroker}
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
