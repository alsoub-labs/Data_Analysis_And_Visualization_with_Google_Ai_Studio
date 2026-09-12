import React, { useRef } from 'react';
import { 
  BarChart3, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar,
  Layers,
  Database
} from 'lucide-react';
import { exportRecordsToCSV, downloadCSV, parseCSVToMarketRecords } from '../utils/dataParser';
import { MarketRecord } from '../types';

interface HeaderProps {
  records: MarketRecord[];
  allRecordsCount: number;
  filteredCount: number;
  onDataUpload: (records: MarketRecord[]) => void;
  onResetFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  records,
  allRecordsCount,
  filteredCount,
  onDataUpload,
  onResetFilters,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    const csvData = exportRecordsToCSV(records);
    downloadCSV(`market_data_export_${new Date().toISOString().slice(0, 10)}.csv`, csvData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVToMarketRecords(text);
        if (parsed.length > 0) {
          onDataUpload(parsed);
        }
      }
    };
    reader.readAsText(file);
    // Reset file input value so the same file can be reloaded if needed
    e.target.value = '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Dataset Indicator */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Global Produce & Commodity Analytics
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Data
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                {filteredCount} of {allRecordsCount} records
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                2016 – 2018 Weekly Series
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                Vietnam, Brazil, India, Indonesia, China
              </span>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Upload New CSV */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,text/csv" 
            className="hidden" 
          />
          <button
            id="btn-upload-csv"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Import custom CSV dataset"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            Import CSV
          </button>

          {/* Export Current View */}
          <button
            id="btn-export-csv"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV ({filteredCount})
          </button>

          {/* Reset Filters */}
          <button
            id="btn-reset-filters"
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
            Reset Filters
          </button>
        </div>
      </div>
    </header>
  );
};
