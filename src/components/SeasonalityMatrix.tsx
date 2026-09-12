import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Sun, Calendar, Sprout, ArrowRight } from 'lucide-react';
import { MarketRecord } from '../types';
import { computeSeasonAnalysis, computeMonthlySeasonality, formatCurrency, formatVolume } from '../utils/analytics';

interface SeasonalityMatrixProps {
  records: MarketRecord[];
}

export const SeasonalityMatrix: React.FC<SeasonalityMatrixProps> = ({ records }) => {
  const seasonStats = computeSeasonAnalysis(records);
  const monthlyData = computeMonthlySeasonality(records);

  // Harvest calendar summary by origin country
  const originSeasons = [
    { country: 'Vietnam', seasons: 'S1 (Jun-Sep), S2 (Oct-Feb), S3 (Mar-May)', status: 'Active Year-round', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { country: 'Brazil', seasons: 'May – Aug peak export window', status: 'Southern Harvest', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { country: 'Indonesia', seasons: 'May – Sep harvest cycle', status: 'Equatorial Cycle', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { country: 'India', seasons: 'Jul – Oct seasonal surge', status: 'Monsoon Cycle', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { country: 'China', seasons: 'May – Sep domestic & export crop', status: 'Northern Harvest', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="space-y-5">
      {/* Top 3 Vietnam Season Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seasonStats.map(s => (
          <div
            key={s.season}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sprout className="h-3 w-3" />
                  Vietnam Season {s.season}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {s.records} entries
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {s.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block">Avg Price</span>
                <span className="text-base font-bold text-slate-900 font-['JetBrains_Mono']">
                  {formatCurrency(s.avgPrice)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Avg Weekly Volume</span>
                <span className="text-base font-bold text-slate-900 font-['JetBrains_Mono']">
                  {formatVolume(s.avgVolume)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Avg Demand</span>
                <span className="font-semibold text-indigo-600 font-['JetBrains_Mono']">
                  {s.avgDemand}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Avg Supply</span>
                <span className="font-semibold text-amber-600 font-['JetBrains_Mono']">
                  {s.avgSupply}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 12-Month Seasonality Pattern Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                12-Month Calendar Seasonality Pattern
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                Aggregated by Month
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Examines intra-year cycles: how trade volume peaks and spot prices oscillate across calendar months.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              {/* Left Y: Volume */}
              <YAxis
                yAxisId="vol"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatVolume(v)}
                label={{ value: 'Volume', angle: -90, position: 'insideLeft', offset: 25, fontSize: 10, fill: '#94a3b8' }}
              />
              {/* Right Y: Price */}
              <YAxis
                yAxisId="price"
                orientation="right"
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#10b981' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v.toFixed(1)}`}
                label={{ value: 'Price ($)', angle: 90, position: 'insideRight', offset: 25, fontSize: 10, fill: '#10b981' }}
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  if (name === 'Average Price') return [formatCurrency(Number(value)), name];
                  if (name === 'Trade Volume') return [formatVolume(Number(value)), name];
                  return [value, name];
                }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
              <Bar yAxisId="vol" dataKey="avgVolume" fill="#0d9488" fillOpacity={0.75} name="Trade Volume" />
              <Line yAxisId="price" type="monotone" dataKey="avgPrice" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Average Price" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global Origin Harvest Windows */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Origin Harvest & Export Season Windows
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Status and scheduling across major producing regions tracked in the dataset.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {originSeasons.map((item) => (
            <div key={item.country} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{item.country}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${item.color}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-600">{item.seasons}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
