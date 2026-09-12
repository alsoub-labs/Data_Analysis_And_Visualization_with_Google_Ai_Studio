import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Palette, TrendingUp, DollarSign } from 'lucide-react';
import { MarketRecord } from '../types';
import { computeVarietyComparison, formatCurrency } from '../utils/analytics';

interface VarietyComparisonProps {
  records: MarketRecord[];
}

export const VarietyComparison: React.FC<VarietyComparisonProps> = ({ records }) => {
  const varietyStats = computeVarietyComparison(records);

  const colorsConfig = {
    green: {
      name: 'Green Variety',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      fill: '#10b981',
    },
    red: {
      name: 'Red Variety',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      fill: '#f43f5e',
    },
    yellow: {
      name: 'Yellow Variety',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      fill: '#f59e0b',
    },
  };

  const chartData = varietyStats.map(v => ({
    name: v.color.toUpperCase(),
    color: v.color,
    'Avg Price': v.avgPrice,
    'Min Price': v.minPrice,
    'Max Price': v.maxPrice,
    'Demand Index': v.avgDemand,
    'Supply Index': v.avgSupply,
  }));

  return (
    <div className="space-y-5">
      {/* 3 Variety Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {varietyStats.map(v => {
          const cfg = colorsConfig[v.color as keyof typeof colorsConfig] || colorsConfig.green;
          return (
            <div
              key={v.color}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {cfg.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {v.count} observations
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 font-['JetBrains_Mono']">
                    {formatCurrency(v.avgPrice)}
                  </span>
                  <span className="text-xs text-slate-500">avg realized spot</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Price Range:</span>
                  <span className="font-semibold text-slate-900 font-['JetBrains_Mono']">
                    {formatCurrency(v.minPrice)} – {formatCurrency(v.maxPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Jordan Corridor Spread:</span>
                  <span className="font-semibold text-slate-900 font-['JetBrains_Mono']">
                    {formatCurrency(v.avgSpread)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Market Demand Index:</span>
                  <span className="font-semibold text-indigo-600 font-['JetBrains_Mono']">
                    {v.avgDemand.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Market Supply Index:</span>
                  <span className="font-semibold text-amber-600 font-['JetBrains_Mono']">
                    {v.avgSupply.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cross-Variety Price & Demand Benchmark
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct comparison of average prices, extremes, and buyer demand indexing across color varieties.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(value: any, name: any) => {
                  if (typeof value === 'number') {
                    return [name.includes('Price') ? formatCurrency(value) : value.toFixed(2), name];
                  }
                  return [value, name];
                }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="Avg Price" fill="#0d9488" radius={[4, 4, 0, 0]} name="Avg Price ($)" />
              <Bar dataKey="Max Price" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Max Price ($)" />
              <Bar dataKey="Min Price" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Min Price ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
