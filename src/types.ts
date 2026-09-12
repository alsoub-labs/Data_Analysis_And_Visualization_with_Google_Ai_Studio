export interface MarketRecord {
  id: string;
  week_start_dt: string;
  week_end_dt: string;
  vietnam_season: number;
  p_color: 'green' | 'red' | 'yellow' | string;
  price: number;
  total_volume: number;
  brazil: number;
  india: number;
  vietnam: number;
  indonesia: number;
  china: number;
  brazil_season: boolean;
  indonesia_season: boolean;
  india_season: boolean;
  china_season: boolean;
  jordan_max_price: number;
  jordan_min_price: number;
  demand: number;
  supply: number;
  month: number;
  year: number;
  DayOfMonth: number;
}

export type VarietyColor = 'green' | 'red' | 'yellow' | 'all';

export type TimeGranularity = 'weekly' | 'monthly' | 'yearly';

export type DashboardTab = 
  | 'overview' 
  | 'prices' 
  | 'origins' 
  | 'supply-demand' 
  | 'seasonality' 
  | 'varieties' 
  | 'table';

export interface DashboardFilters {
  selectedYears: number[];
  selectedColors: string[];
  selectedSeasons: number[];
  onlyInSeason: boolean;
  searchQuery: string;
  granularity: TimeGranularity;
  priceMetric: 'price' | 'jordan_corridor' | 'spread';
}

export interface AggregatedPoint {
  periodKey: string;
  displayLabel: string;
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  jordanMax: number;
  jordanMin: number;
  spread: number;
  totalVolume: number;
  vietnamVolume: number;
  brazilVolume: number;
  indiaVolume: number;
  indonesiaVolume: number;
  chinaVolume: number;
  demand: number;
  supply: number;
  marketBalance: number; // demand - supply
  recordCount: number;
  // variety specific prices
  greenPrice?: number;
  redPrice?: number;
  yellowPrice?: number;
}

export interface SummaryStats {
  recordCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalVolume: number;
  avgWeeklyVolume: number;
  avgDemand: number;
  avgSupply: number;
  topOriginCountry: string;
  topOriginVolume: number;
  topOriginSharePct: number;
  vietnamSharePct: number;
  brazilSharePct: number;
  indiaSharePct: number;
  indonesiaSharePct: number;
  chinaSharePct: number;
}
