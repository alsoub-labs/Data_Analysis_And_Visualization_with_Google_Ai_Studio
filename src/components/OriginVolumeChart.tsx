import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AggregatedPoint, SummaryStats } from '../types';
import { formatVolume } from '../utils/analytics';

interface OriginVolumeChartProps {
  data: AggregatedPoint[];
  stats: SummaryStats;
  onSelectPoint?: (point: AggregatedPoint) => void;
}

const COUNTRY_COLORS = {
  vietnam: '#0d9488', // teal-600
  brazil: '#10b981',  // emerald-500
  indonesia: '#6366f1', // indigo-500
  india: '#f59e0b',    // amber-500
  china: '#f43f5e',    // rose-500
};

export const OriginVolumeChart: React.FC<OriginVolumeChartProps> = ({
  data,
  stats,
  onSelectPoint,
}) => {
  const [chartType, setChartType] = useState<'stacked-area' | 'stacked-bar'>('stacked-area');

  // Country Pie Data
  const pieData = [
    { name: 'Vietnam', value: stats.vietnamSharePct, color: COUNTRY_COLORS.vietnam },
    { name: 'Brazil', value: stats.brazilSharePct, color: COUNTRY_COLORS.brazil },
    { name: 'Indonesia', value: stats.indonesiaSharePct, color: COUNTRY_COLORS.indonesia },
    { name: 'India', value: stats.indiaSharePct, color: COUNTRY_COLORS.india },
    { name: 'China', value: stats.chinaSharePct, color: COUNTRY_COLORS.china },
  ].filter(d => d.value > 0.05);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: AggregatedPoint = payload[0].payload;
      const total = item.vietnamVolume + item.brazilVolume + item.indonesiaVolume + item.indiaVolume + item.chinaVolume;

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs min-w-[200px] backdrop-blur-xs">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-2">
            Period: {item.displayLabel}
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-teal-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Vietnam:
              </span>
              <span className="font-bold font-['JetBrains_Mono']">
                {formatVolume(item.vietnamVolume)} ({total > 0 ? ((item.vietnamVolume / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Brazil:
              </span>
              <span className="font-bold font-['JetBrains_Mono']">
                {formatVolume(item.brazilVolume)} ({total > 0 ? ((item.brazilVolume / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Indonesia:
              </span>
              <span className="font-bold font-['JetBrains_Mono']">
                {formatVolume(item.indonesiaVolume)} ({total > 0 ? ((item.indonesiaVolume / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                India:
              </span>
              <span className="font-bold font-['JetBrains_Mono']">
                {formatVolume(item.indiaVolume)} ({total > 0 ? ((item.indiaVolume / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                China:
              </span>
              <span className="font-bold font-['JetBrains_Mono']">
                {formatVolume(item.chinaVolume)} ({total > 0 ? ((item.chinaVolume / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-700 flex justify-between font-bold text-slate-100">
              <span>Total Volume:</span>
              <span className="font-['JetBrains_Mono']">{formatVolume(item.totalVolume)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Main Timeline Stacked Area Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Origin Country Export Volume Timeline
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                Units
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Production volume contribution over time across Vietnam, Brazil, Indonesia, India, and China.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartType('stacked-area')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                chartType === 'stacked-area'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stacked Area
            </button>
            <button
              type="button"
              onClick={() => setChartType('stacked-bar')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                chartType === 'stacked-bar'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stacked Bar
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'stacked-area' ? (
              <AreaChart
                data={data}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length && onSelectPoint) {
                    onSelectPoint(e.activePayload[0].payload);
                  }
                }}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="displayLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  minTickGap={25}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatVolume(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="vietnamVolume"
                  stackId="1"
                  stroke={COUNTRY_COLORS.vietnam}
                  fill={COUNTRY_COLORS.vietnam}
                  fillOpacity={0.8}
                  name="Vietnam"
                />
                <Area
                  type="monotone"
                  dataKey="brazilVolume"
                  stackId="1"
                  stroke={COUNTRY_COLORS.brazil}
                  fill={COUNTRY_COLORS.brazil}
                  fillOpacity={0.8}
                  name="Brazil"
                />
                <Area
                  type="monotone"
                  dataKey="indonesiaVolume"
                  stackId="1"
                  stroke={COUNTRY_COLORS.indonesia}
                  fill={COUNTRY_COLORS.indonesia}
                  fillOpacity={0.8}
                  name="Indonesia"
                />
                <Area
                  type="monotone"
                  dataKey="indiaVolume"
                  stackId="1"
                  stroke={COUNTRY_COLORS.india}
                  fill={COUNTRY_COLORS.india}
                  fillOpacity={0.8}
                  name="India"
                />
                <Area
                  type="monotone"
                  dataKey="chinaVolume"
                  stackId="1"
                  stroke={COUNTRY_COLORS.china}
                  fill={COUNTRY_COLORS.china}
                  fillOpacity={0.8}
                  name="China"
                />
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length && onSelectPoint) {
                    onSelectPoint(e.activePayload[0].payload);
                  }
                }}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="displayLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  minTickGap={25}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatVolume(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="vietnamVolume" stackId="a" fill={COUNTRY_COLORS.vietnam} name="Vietnam" />
                <Bar dataKey="brazilVolume" stackId="a" fill={COUNTRY_COLORS.brazil} name="Brazil" />
                <Bar dataKey="indonesiaVolume" stackId="a" fill={COUNTRY_COLORS.indonesia} name="Indonesia" />
                <Bar dataKey="indiaVolume" stackId="a" fill={COUNTRY_COLORS.india} name="India" />
                <Bar dataKey="chinaVolume" stackId="a" fill={COUNTRY_COLORS.china} name="China" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Origin Market Share Donut Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Global Origin Market Share
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated volume distribution by producing export country.
          </p>
        </div>

        <div className="h-52 w-full my-2 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Share']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium">Top Origin</span>
            <span className="text-base font-bold text-slate-900">{stats.topOriginCountry}</span>
            <span className="text-xs font-semibold text-teal-600">{stats.topOriginSharePct.toFixed(1)}%</span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          {pieData.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 font-['JetBrains_Mono']">
                  {item.value.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
