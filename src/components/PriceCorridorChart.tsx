import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Layers, Sliders } from 'lucide-react';
import { AggregatedPoint } from '../types';
import { formatCurrency } from '../utils/analytics';

interface PriceCorridorChartProps {
  data: AggregatedPoint[];
  onSelectPoint?: (point: AggregatedPoint) => void;
}

export const PriceCorridorChart: React.FC<PriceCorridorChartProps> = ({
  data,
  onSelectPoint,
}) => {
  const [viewMode, setViewMode] = useState<'corridor' | 'varieties' | 'spread'>('corridor');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: AggregatedPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs max-w-xs backdrop-blur-xs">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-2">
            Period: {item.displayLabel} ({item.date})
          </p>
          <div className="space-y-1">
            {viewMode === 'corridor' && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-400 font-medium">Market Spot Price:</span>
                  <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.avgPrice)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-amber-400">Jordan Max Benchmark:</span>
                  <span className="font-['JetBrains_Mono']">{formatCurrency(item.jordanMax)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sky-400">Jordan Min Benchmark:</span>
                  <span className="font-['JetBrains_Mono']">{formatCurrency(item.jordanMin)}</span>
                </div>
                <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-slate-400">
                  <span>Corridor Spread:</span>
                  <span className="font-['JetBrains_Mono']">{formatCurrency(item.spread)}</span>
                </div>
              </>
            )}

            {viewMode === 'varieties' && (
              <>
                {item.yellowPrice !== undefined && (
                  <div className="flex justify-between gap-4">
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Yellow Variety:
                    </span>
                    <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.yellowPrice)}</span>
                  </div>
                )}
                {item.redPrice !== undefined && (
                  <div className="flex justify-between gap-4">
                    <span className="text-rose-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Red Variety:
                    </span>
                    <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.redPrice)}</span>
                  </div>
                )}
                {item.greenPrice !== undefined && (
                  <div className="flex justify-between gap-4">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Green Variety:
                    </span>
                    <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.greenPrice)}</span>
                  </div>
                )}
              </>
            )}

            {viewMode === 'spread' && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-indigo-400 font-medium">Corridor Spread (Max - Min):</span>
                  <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.spread)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Market Price:</span>
                  <span className="font-['JetBrains_Mono']">{formatCurrency(item.avgPrice)}</span>
                </div>
              </>
            )}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 italic text-center">
            Click data point to inspect full weekly metrics
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Price Dynamics & Jordan Benchmark Corridor
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
              USD / Unit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate spot prices against the Jordan maximum/minimum regulatory pricing band and cross-variety premiums.
          </p>
        </div>

        {/* Chart Mode Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('corridor')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'corridor'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jordan Corridor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('varieties')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'varieties'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Variety Comparison
          </button>
          <button
            type="button"
            onClick={() => setViewMode('spread')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'spread'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Band Spread
          </button>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length && onSelectPoint) {
                onSelectPoint(e.activePayload[0].payload);
              }
            }}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Corridor Gradient */}
              <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="spreadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="displayLabel"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              minTickGap={25}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />

            {viewMode === 'corridor' && (
              <>
                <Area
                  type="monotone"
                  dataKey="jordanMax"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#corridorGrad)"
                  name="Jordan Max Band"
                />
                <Line
                  type="monotone"
                  dataKey="jordanMin"
                  stroke="#0284c7"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Jordan Min Band"
                />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={data.length <= 40 ? { r: 3, fill: '#10b981' } : false}
                  activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  name="Market Spot Price"
                />
              </>
            )}

            {viewMode === 'varieties' && (
              <>
                <Line
                  type="monotone"
                  dataKey="yellowPrice"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  name="Yellow Variety ($)"
                />
                <Line
                  type="monotone"
                  dataKey="redPrice"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={false}
                  name="Red Variety ($)"
                />
                <Line
                  type="monotone"
                  dataKey="greenPrice"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  name="Green Variety ($)"
                />
              </>
            )}

            {viewMode === 'spread' && (
              <>
                <Area
                  type="monotone"
                  dataKey="spread"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#spreadGrad)"
                  name="Corridor Spread (Max - Min)"
                />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={false}
                  name="Spot Price"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Quick context info */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-slate-600">
            <strong>Spot Price:</strong> Tracks actual realized commodity transaction value.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="text-slate-600">
            <strong>Benchmark Bounds:</strong> Jordan Max / Min establish the official trade corridor.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
          <span className="text-slate-600">
            <strong>Click any point:</strong> Opens the full 22-parameter week inspect modal.
          </span>
        </div>
      </div>
    </div>
  );
};
