import { MarketRecord } from '../types';
import rawMarketData from '../data/marketData.json';

export const INITIAL_MARKET_DATA: MarketRecord[] = rawMarketData as MarketRecord[];

/**
 * Parses raw CSV text into MarketRecord array with validation
 */
export function parseCSVToMarketRecords(csvText: string): MarketRecord[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find column indices
  const getIdx = (name: string) => headers.indexOf(name.toLowerCase());
  
  const colMap = {
    week_start_dt: getIdx('week_start_dt'),
    week_end_dt: getIdx('week_end_dt'),
    vietnam_season: getIdx('vietnam_season'),
    p_color: getIdx('p_color'),
    price: getIdx('price'),
    total_volume: getIdx('total_volume'),
    brazil: getIdx('brazil'),
    india: getIdx('india'),
    vietnam: getIdx('vietnam'),
    indonesia: getIdx('indonesia'),
    china: getIdx('china'),
    brazil_season: getIdx('brazil_season'),
    indonesia_season: getIdx('indonesia_season'),
    india_season: getIdx('india_season'),
    china_season: getIdx('china_season'),
    jordan_max_price: getIdx('jordan_max_price'),
    jordan_min_price: getIdx('jordan_min_price'),
    demand: getIdx('demand'),
    supply: getIdx('supply'),
    month: getIdx('month'),
    year: getIdx('year'),
    DayOfMonth: getIdx('dayofmonth'),
  };

  const records: MarketRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(p => p.trim());
    if (parts.length < 10) continue;

    const row: MarketRecord = {
      id: `rec-${i}`,
      week_start_dt: colMap.week_start_dt >= 0 ? parts[colMap.week_start_dt] : '',
      week_end_dt: colMap.week_end_dt >= 0 ? parts[colMap.week_end_dt] : '',
      vietnam_season: colMap.vietnam_season >= 0 ? Number(parts[colMap.vietnam_season]) || 1 : 1,
      p_color: colMap.p_color >= 0 ? parts[colMap.p_color].toLowerCase() : 'green',
      price: colMap.price >= 0 ? Number(parts[colMap.price]) || 0 : 0,
      total_volume: colMap.total_volume >= 0 ? Number(parts[colMap.total_volume]) || 0 : 0,
      brazil: colMap.brazil >= 0 ? Number(parts[colMap.brazil]) || 0 : 0,
      india: colMap.india >= 0 ? Number(parts[colMap.india]) || 0 : 0,
      vietnam: colMap.vietnam >= 0 ? Number(parts[colMap.vietnam]) || 0 : 0,
      indonesia: colMap.indonesia >= 0 ? Number(parts[colMap.indonesia]) || 0 : 0,
      china: colMap.china >= 0 ? Number(parts[colMap.china]) || 0 : 0,
      brazil_season: colMap.brazil_season >= 0 ? parts[colMap.brazil_season]?.toLowerCase() === 'true' : false,
      indonesia_season: colMap.indonesia_season >= 0 ? parts[colMap.indonesia_season]?.toLowerCase() === 'true' : false,
      india_season: colMap.india_season >= 0 ? parts[colMap.india_season]?.toLowerCase() === 'true' : false,
      china_season: colMap.china_season >= 0 ? parts[colMap.china_season]?.toLowerCase() === 'true' : false,
      jordan_max_price: colMap.jordan_max_price >= 0 ? Number(parts[colMap.jordan_max_price]) || 0 : 0,
      jordan_min_price: colMap.jordan_min_price >= 0 ? Number(parts[colMap.jordan_min_price]) || 0 : 0,
      demand: colMap.demand >= 0 ? Number(parts[colMap.demand]) || 0 : 0,
      supply: colMap.supply >= 0 ? Number(parts[colMap.supply]) || 0 : 0,
      month: colMap.month >= 0 ? Number(parts[colMap.month]) || 1 : 1,
      year: colMap.year >= 0 ? Number(parts[colMap.year]) || 2016 : 2016,
      DayOfMonth: colMap.DayOfMonth >= 0 ? Number(parts[colMap.DayOfMonth]) || 1 : 1,
    };

    records.push(row);
  }

  return records;
}

/**
 * Converts MarketRecord array back to CSV string for downloading
 */
export function exportRecordsToCSV(records: MarketRecord[]): string {
  const headers = [
    'week_start_dt',
    'week_end_dt',
    'vietnam_season',
    'p_color',
    'price',
    'total_volume',
    'brazil',
    'india',
    'vietnam',
    'indonesia',
    'china',
    'brazil_season',
    'indonesia_season',
    'india_season',
    'china_season',
    'jordan_max_price',
    'jordan_min_price',
    'demand',
    'supply',
    'month',
    'year',
    'DayOfMonth'
  ];

  const rows = records.map(r => [
    r.week_start_dt,
    r.week_end_dt,
    r.vietnam_season,
    r.p_color,
    r.price.toFixed(4),
    r.total_volume.toFixed(1),
    r.brazil.toFixed(1),
    r.india.toFixed(1),
    r.vietnam.toFixed(1),
    r.indonesia.toFixed(1),
    r.china.toFixed(1),
    r.brazil_season,
    r.indonesia_season,
    r.india_season,
    r.china_season,
    r.jordan_max_price.toFixed(3),
    r.jordan_min_price.toFixed(3),
    r.demand.toFixed(2),
    r.supply.toFixed(2),
    r.month,
    r.year,
    r.DayOfMonth
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Trigger CSV download in browser
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
