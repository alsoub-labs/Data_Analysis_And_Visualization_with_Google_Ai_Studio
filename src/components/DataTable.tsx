import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Tag, 
  Calendar 
} from 'lucide-react';
import { MarketRecord } from '../types';
import { formatCurrency, formatVolume } from '../utils/analytics';

interface DataTableProps {
  records: MarketRecord[];
  onSelectRecord: (record: MarketRecord) => void;
}

type SortKey = keyof MarketRecord;

export const DataTable: React.FC<DataTableProps> = ({ records, onSelectRecord }) => {
  const [sortKey, setSortKey] = useState<SortKey>('week_start_dt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [records, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const paginatedRecords = sortedRecords.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const getColorBadge = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'red':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'yellow':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Raw Market Records Explorer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Displaying {sortedRecords.length} filtered entries. Click column headers to sort, or inspect row to see full 22 parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 font-medium"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('week_start_dt')}>
                <div className="flex items-center gap-1">
                  Week Period
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-900" onClick={() => handleSort('p_color')}>
                <div className="flex items-center gap-1">
                  Variety
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  Spot Price
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('jordan_max_price')}>
                <div className="flex items-center justify-end gap-1">
                  Jordan Max
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('jordan_min_price')}>
                <div className="flex items-center justify-end gap-1">
                  Jordan Min
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('total_volume')}>
                <div className="flex items-center justify-end gap-1">
                  Total Volume
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('vietnam')}>
                <div className="flex items-center justify-end gap-1">
                  Vietnam
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('brazil')}>
                <div className="flex items-center justify-end gap-1">
                  Brazil
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('demand')}>
                <div className="flex items-center justify-end gap-1">
                  Demand
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('supply')}>
                <div className="flex items-center justify-end gap-1">
                  Supply
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Season</th>
              <th className="py-3 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-400">
                  No records match your active filters. Try clearing some filters.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => (
                <tr 
                  key={r.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onSelectRecord(r)}
                >
                  <td className="py-2.5 px-4 text-slate-900 whitespace-nowrap font-['JetBrains_Mono']">
                    {r.week_start_dt} → {r.week_end_dt.slice(5)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${getColorBadge(r.p_color)}`}>
                      {r.p_color}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-['JetBrains_Mono']">
                    {formatCurrency(r.price)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-600 font-['JetBrains_Mono']">
                    {formatCurrency(r.jordan_max_price)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-sky-600 font-['JetBrains_Mono']">
                    {formatCurrency(r.jordan_min_price)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-800 font-['JetBrains_Mono']">
                    {formatVolume(r.total_volume)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-teal-700 font-['JetBrains_Mono']">
                    {formatVolume(r.vietnam)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-['JetBrains_Mono']">
                    {formatVolume(r.brazil)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-600 font-['JetBrains_Mono']">
                    {r.demand.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-600 font-['JetBrains_Mono']">
                    {r.supply.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      S{r.vietnam_season}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(r);
                      }}
                      className="p-1 rounded text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors"
                      title="Inspect record"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing page <span className="font-bold text-slate-900">{pageIndex}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({sortedRecords.length} total rows)
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pageIndex <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold text-slate-800">
            {pageIndex} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pageIndex >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
