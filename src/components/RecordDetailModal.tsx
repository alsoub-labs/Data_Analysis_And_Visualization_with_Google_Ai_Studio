import React from 'react';
import { 
  X, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Package, 
  Globe2, 
  Scale, 
  Sun,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { MarketRecord } from '../types';
import { formatCurrency, formatVolume } from '../utils/analytics';

interface RecordDetailModalProps {
  record: MarketRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const totalOriginSum = record.vietnam + record.brazil + record.india + record.indonesia + record.china;
  const spread = record.jordan_max_price - record.jordan_min_price;

  const countries = [
    { name: 'Vietnam', vol: record.vietnam, inSeason: true, color: 'bg-teal-500' },
    { name: 'Brazil', vol: record.brazil, inSeason: record.brazil_season, color: 'bg-emerald-500' },
    { name: 'Indonesia', vol: record.indonesia, inSeason: record.indonesia_season, color: 'bg-indigo-500' },
    { name: 'India', vol: record.india, inSeason: record.india_season, color: 'bg-amber-500' },
    { name: 'China', vol: record.china, inSeason: record.china_season, color: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${
              record.p_color === 'green' ? 'bg-emerald-600' :
              record.p_color === 'red' ? 'bg-rose-600' : 'bg-amber-500'
            }`}>
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {record.p_color} Variety Week Inspection
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 font-['JetBrains_Mono']">
                  ID: {record.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-['JetBrains_Mono']">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {record.week_start_dt} → {record.week_end_dt} (Year {record.year}, Month {record.month})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Price Metrics Grid */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Price Realization & Jordan Benchmark Corridor
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-emerald-800 block font-medium">Realized Spot Price</span>
                <span className="text-xl font-bold text-emerald-950 font-['JetBrains_Mono']">
                  {formatCurrency(record.price)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-amber-800 block font-medium">Jordan Max Band</span>
                <span className="text-xl font-bold text-amber-950 font-['JetBrains_Mono']">
                  {formatCurrency(record.jordan_max_price)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                <span className="text-sky-800 block font-medium">Jordan Min Band</span>
                <span className="text-xl font-bold text-sky-950 font-['JetBrains_Mono']">
                  {formatCurrency(record.jordan_min_price)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block font-medium">Corridor Spread</span>
                <span className="text-xl font-bold text-slate-900 font-['JetBrains_Mono']">
                  {formatCurrency(spread)}
                </span>
              </div>
            </div>
          </div>

          {/* Volume Breakdown by Origin */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-teal-600" />
                Origin Country Export Breakdown
              </h4>
              <span className="text-slate-500 font-medium font-['JetBrains_Mono']">
                Total Week Volume: <strong>{formatVolume(record.total_volume)}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {countries.map(c => {
                const pct = totalOriginSum > 0 ? (c.vol / totalOriginSum) * 100 : 0;
                return (
                  <div key={c.name} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                        <span className="font-semibold text-slate-900">{c.name}</span>
                        {c.inSeason && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                            Harvest Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-['JetBrains_Mono']">
                          {formatVolume(c.vol)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          ({pct.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${c.color} rounded-full transition-all`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Balance & Seasonal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supply & Demand */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-indigo-600" />
                Supply & Demand Index
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Buyer Demand Index:</span>
                <span className="font-bold text-indigo-600 font-['JetBrains_Mono']">{record.demand.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Market Supply Index:</span>
                <span className="font-bold text-amber-600 font-['JetBrains_Mono']">{record.supply.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Net Balance:</span>
                <span className="font-bold font-['JetBrains_Mono']">
                  {(record.demand - record.supply).toFixed(2)} ({record.demand > record.supply ? 'High Demand' : 'Supply Surplus'})
                </span>
              </div>
            </div>

            {/* Vietnam Season & Origins Harvest */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                Seasonal Parameters
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Vietnam Season Phase:</span>
                <span className="font-bold text-slate-900">
                  Season {record.vietnam_season} ({record.vietnam_season === 1 ? 'Early Crop' : record.vietnam_season === 2 ? 'Peak Harvest' : 'Late Crop'})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Active Origin Harvests:</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {record.brazil_season && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Brazil</span>}
                  {record.indonesia_season && <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-semibold">Indonesia</span>}
                  {record.india_season && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">India</span>}
                  {record.china_season && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-semibold">China</span>}
                  {!record.brazil_season && !record.indonesia_season && !record.india_season && !record.china_season && (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
