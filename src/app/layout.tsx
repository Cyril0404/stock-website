import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '股票助手 - 今日A股',
  description: '涨跌停表格、AI早报、开户入口',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
