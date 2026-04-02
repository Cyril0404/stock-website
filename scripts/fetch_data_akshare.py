#!/usr/bin/env python3
"""
每日市场数据抓取脚本 v2
使用 akshare 获取当日市场数据，输出到 data/website_data.json

v2改进：
- 用 akshare 替代新浪API（更稳定，有行业字段）
- 涨停数据包含连板数和行业分类
- 跌停数据使用正确的 API

用法: python3 scripts/fetch_data_akshare.py
Cron: 每天 15:35 执行（A股收盘后）
"""

import json
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')

def get_today_str():
    return datetime.now().strftime("%Y%m%d")

def get_prev_close(code):
    """获取前一交易日收盘价"""
    import akshare as ak
    try:
        if code.startswith('6'):
            symbol = f'sh{code}'
        else:
            symbol = f'sz{code}'
        df = ak.stock_zh_index_daily(symbol=symbol)
        if len(df) < 2:
            return None
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        return prev['close']
    except:
        return None

def fetch_limit_up():
    """获取今日涨停数据"""
    import akshare as ak
    try:
        df = ak.stock_zt_pool_em(date=get_today_str())
        records = []
        for _, row in df.iterrows():
            records.append({
                "symbol": str(row.get('代码', '')),
                "code": str(row.get('代码', '')),
                "name": str(row.get('名称', '')),
                "trade": str(row.get('最新价', '')),
                "pricechange": float(row.get('涨跌幅', 0)),
                "changepercent": float(row.get('涨跌幅', 0)),
                "buy": str(row.get('最新价', '')),
                "sell": "0.000",
                "settlement": "0.000",
                "open": "0.000",
                "high": "0.000",
                "low": "0.000",
                "volume": int(row.get('成交额', 0)),
                "amount": float(row.get('成交额', 0)),
                "ticktime": "",
                "per": 0.0,
                "pb": 0.0,
                "mktcap": 0.0,
                "nmc": 0.0,
                "turnoverratio": float(row.get('换手率', 0)),
                # akshare 特有字段
                "reason": str(row.get('所属行业', '其它')),  # 行业分类！
                "boards": int(row.get('连板数', 1)),
                "limit_str": str(row.get('涨停统计', '')),
            })
        return records
    except Exception as e:
        print(f"[ERROR] fetch_limit_up: {e}")
        return []

def fetch_limit_down():
    """获取今日跌停数据"""
    import akshare as ak
    try:
        df = ak.stock_zt_pool_dtgc_em(date=get_today_str())
        records = []
        for _, row in df.iterrows():
            records.append({
                "symbol": str(row.get('代码', '')),
                "code": str(row.get('代码', '')),
                "name": str(row.get('名称', '')),
                "trade": str(row.get('最新价', '')),
                "pricechange": float(row.get('涨跌幅', 0)),
                "changepercent": float(row.get('涨跌幅', 0)),
                "volume": int(row.get('成交额', 0)),
                "amount": float(row.get('成交额', 0)),
                "reason": str(row.get('所属行业', '其它')),
            })
        return records
    except Exception as e:
        print(f"[ERROR] fetch_limit_down: {e}")
        return []

def fetch_indices():
    """获取大盘指数"""
    indices = {}
    try:
        import akshare as ak
        index_codes = [
            ('sh000001', '上证指数'),
            ('sz399001', '深证成指'),
            ('sz399006', '创业板指'),
            ('sh000300', '沪深300'),
        ]
        for code, name in index_codes:
            try:
                df = ak.stock_zh_index_daily(symbol=code)
                if len(df) < 2:
                    continue
                latest = df.iloc[-1]
                prev = df.iloc[-2]
                pct = (latest['close'] - prev['close']) / prev['close'] * 100
                indices[code] = {
                    'name': name,
                    'price': f"{latest['close']:.2f}",
                    'pct': f"{pct:+.2f}",
                    'high': f"{latest['high']:.2f}",
                    'low': f"{latest['low']:.2f}"
                }
            except Exception as e:
                print(f"[ERROR] fetch {code}: {e}")
    except Exception as e:
        print(f"[ERROR] fetch_indices: {e}")
    return indices

def main():
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    print(f"[{today}] 开始抓取市场数据...")

    indices = fetch_indices()
    limit_up = fetch_limit_up()
    limit_down = fetch_limit_down()

    data = {
        'updated_at': today,
        'indices': indices,
        'limit_up': limit_up,
        'limit_down': limit_down,
    }

    output_path = 'data/website_data.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[{today}] 完成！涨停:{len(limit_up)}只 跌停:{len(limit_down)}只 指数:{len(indices)}个")
    return data

if __name__ == '__main__':
    main()
