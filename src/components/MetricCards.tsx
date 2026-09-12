import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Globe2, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SummaryStats } from '../types';
import { formatCurrency, formatVolume } from '../utils/analytics';

interface MetricCardsProps {
  stats: SummaryStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  const balanceDelta = stats.avgDemand - stats.avgSupply;
  const isSurplus = balanceDelta < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Average Market Price */}
      <div 
        id="card-metric-price"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Price
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-['JetBrains_Mono']">
            {formatCurrency(stats.avgPrice)}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ unit</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Range: {formatCurrency(stats.minPrice)} – {formatCurrency(stats.maxPrice)}</span>
          <span className="font-semibold text-slate-700">
            Δ {(stats.maxPrice - stats.minPrice).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Metric 2: Total Volume & Weekly Throughput */}
      <div 
        id="card-metric-volume"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Trade Volume
          </span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Package className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-['JetBrains_Mono']">
            {formatVolume(stats.totalVolume)}
          </span>
          <span className="text-xs text-slate-400 font-medium">units</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Avg Weekly:</span>
          <span className="font-semibold text-slate-700 font-['JetBrains_Mono']">
            {formatVolume(stats.avgWeeklyVolume)} / wk
          </span>
        </div>
      </div>

      {/* Metric 3: Dominant Origin Share */}
      <div 
        id="card-metric-origin"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Leading Origin
          </span>
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Globe2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            {stats.topOriginCountry}
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {stats.topOriginSharePct.toFixed(1)}%
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Supplied: {formatVolume(stats.topOriginVolume)}</span>
          <span>Brazil: {stats.brazilSharePct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Metric 4: Demand vs Supply Balance */}
      <div 
        id="card-metric-balance"
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Supply / Demand Pressure
          </span>
          <div className={`p-2 rounded-lg ${isSurplus ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <Scale className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-['JetBrains_Mono']">
            {stats.avgDemand.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-medium">demand index</span>
          <span className="text-xs text-slate-300">vs</span>
          <span className="text-base font-semibold text-slate-600 font-['JetBrains_Mono']">
            {stats.avgSupply.toFixed(1)}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Market Equilibrium:</span>
          <span className={`inline-flex items-center font-semibold ${isSurplus ? 'text-amber-600' : 'text-indigo-600'}`}>
            {isSurplus ? (
              <>
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                Surplus Supply
              </>
            ) : (
              <>
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                High Demand
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
