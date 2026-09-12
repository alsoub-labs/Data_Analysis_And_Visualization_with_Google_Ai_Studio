import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Scale, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { AggregatedPoint } from '../types';
import { formatCurrency } from '../utils/analytics';

interface SupplyDemandChartProps {
  data: AggregatedPoint[];
  onSelectPoint?: (point: AggregatedPoint) => void;
}

export const SupplyDemandChart: React.FC<SupplyDemandChartProps> = ({
  data,
  onSelectPoint,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: AggregatedPoint = payload[0].payload;
      const isDeficit = item.marketBalance > 0;

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs min-w-[220px] backdrop-blur-xs">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-2">
            Period: {item.displayLabel} ({item.date})
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-indigo-400">
              <span>Demand Index:</span>
              <span className="font-bold font-['JetBrains_Mono']">{item.demand.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-amber-400">
              <span>Supply Index:</span>
              <span className="font-bold font-['JetBrains_Mono']">{item.supply.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span>Realized Price:</span>
              <span className="font-bold font-['JetBrains_Mono']">{formatCurrency(item.avgPrice)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-700 flex justify-between items-center">
              <span>Market Balance:</span>
              <span className={`font-bold flex items-center gap-1 ${isDeficit ? 'text-indigo-400' : 'text-amber-400'}`}>
                {isDeficit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {item.marketBalance > 0 ? `+${item.marketBalance.toFixed(2)} (Demand Pull)` : `${item.marketBalance.toFixed(2)} (Supply Glut)`}
              </span>
            </div>
          </div>
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
              Market Equilibrium: Supply vs Demand & Price Impact
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
              Dual Axis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare commodity demand index against supply volume pressure and observe price elasticity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-600">Bars show Net Delta (Demand − Supply)</span>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="displayLabel"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              minTickGap={25}
            />
            {/* Left Y-axis: Demand / Supply Index */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Index', angle: -90, position: 'insideLeft', offset: 25, fontSize: 10, fill: '#94a3b8' }}
            />
            {/* Right Y-axis: Price ($) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: '#10b981' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
              label={{ value: 'Price ($)', angle: 90, position: 'insideRight', offset: 25, fontSize: 10, fill: '#10b981' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
            <ReferenceLine yAxisId="left" y={0} stroke="#cbd5e1" />

            <Bar
              yAxisId="left"
              dataKey="marketBalance"
              fill="#93c5fd"
              name="Balance Delta (D - S)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="demand"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              name="Demand Index"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="supply"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Supply Index"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgPrice"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              name="Market Price ($)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
        <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100">
          <span className="font-semibold text-indigo-900 block mb-1">
            Buyer Demand Pull (Positive Delta)
          </span>
          <p className="text-indigo-700">
            When the Demand Index exceeds Supply, commodity spot prices face upward pressure toward the upper Jordan threshold.
          </p>
        </div>
        <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100">
          <span className="font-semibold text-amber-900 block mb-1">
            Supply Glut / Surplus (Negative Delta)
          </span>
          <p className="text-amber-700">
            During heavy harvest or export flows (e.g. peak Vietnam Season 2), supply surges soften prices toward the Jordan minimum boundary.
          </p>
        </div>
      </div>
    </div>
  );
};
