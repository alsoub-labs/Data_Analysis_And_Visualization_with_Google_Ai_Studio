import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Tag, 
  Clock, 
  TrendingUp,
  Globe2,
  Scale,
  Sun,
  Palette,
  Table as TableIcon,
  LayoutDashboard
} from 'lucide-react';
import { DashboardFilters, DashboardTab, TimeGranularity } from '../types';

interface FilterBarProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  availableYears: number[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  activeTab,
  onTabChange,
  availableYears,
}) => {
  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'prices', label: 'Price & Jordan Corridor', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'origins', label: 'Origin Volume Share', icon: <Globe2 className="h-4 w-4" /> },
    { id: 'supply-demand', label: 'Supply vs Demand', icon: <Scale className="h-4 w-4" /> },
    { id: 'seasonality', label: 'Seasonal Cycles', icon: <Sun className="h-4 w-4" /> },
    { id: 'varieties', label: 'Variety Matrix', icon: <Palette className="h-4 w-4" /> },
    { id: 'table', label: 'Raw Data Explorer', icon: <TableIcon className="h-4 w-4" /> },
  ];

  const handleYearToggle = (year: number) => {
    if (filters.selectedYears.includes(year)) {
      if (filters.selectedYears.length === 1) {
        // If clicking the only selected year, clear to select all
        onFilterChange({ ...filters, selectedYears: [] });
      } else {
        onFilterChange({
          ...filters,
          selectedYears: filters.selectedYears.filter(y => y !== year),
        });
      }
    } else {
      onFilterChange({
        ...filters,
        selectedYears: [...filters.selectedYears, year],
      });
    }
  };

  const handleSelectAllYears = () => {
    onFilterChange({ ...filters, selectedYears: [] });
  };

  const handleColorToggle = (color: string) => {
    if (filters.selectedColors.includes(color)) {
      if (filters.selectedColors.length === 1) {
        onFilterChange({ ...filters, selectedColors: [] });
      } else {
        onFilterChange({
          ...filters,
          selectedColors: filters.selectedColors.filter(c => c !== color),
        });
      }
    } else {
      onFilterChange({
        ...filters,
        selectedColors: [...filters.selectedColors, color],
      });
    }
  };

  const handleSeasonToggle = (season: number) => {
    if (filters.selectedSeasons.includes(season)) {
      if (filters.selectedSeasons.length === 1) {
        onFilterChange({ ...filters, selectedSeasons: [] });
      } else {
        onFilterChange({
          ...filters,
          selectedSeasons: filters.selectedSeasons.filter(s => s !== season),
        });
      }
    } else {
      onFilterChange({
        ...filters,
        selectedSeasons: [...filters.selectedSeasons, season],
      });
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 py-1 gap-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Controls Bar */}
        <div className="py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <span className="text-slate-400 pl-1.5 flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                Year:
              </span>
              <button
                id="btn-year-all"
                type="button"
                onClick={handleSelectAllYears}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filters.selectedYears.length === 0
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {availableYears.map(yr => {
                const selected = filters.selectedYears.includes(yr);
                return (
                  <button
                    key={yr}
                    id={`btn-year-${yr}`}
                    type="button"
                    onClick={() => handleYearToggle(yr)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>

            {/* Variety Color Chips */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <span className="text-slate-400 pl-1.5 flex items-center gap-1 font-medium">
                <Tag className="h-3 w-3" />
                Variety:
              </span>
              <button
                id="btn-variety-all"
                type="button"
                onClick={() => onFilterChange({ ...filters, selectedColors: [] })}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filters.selectedColors.length === 0
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {(['green', 'red', 'yellow'] as const).map(color => {
                const selected = filters.selectedColors.includes(color);
                const colorConfig = {
                  green: {
                    active: 'bg-emerald-600 text-white',
                    dot: 'bg-emerald-500',
                  },
                  red: {
                    active: 'bg-rose-600 text-white',
                    dot: 'bg-rose-500',
                  },
                  yellow: {
                    active: 'bg-amber-500 text-white',
                    dot: 'bg-amber-400',
                  },
                }[color];

                return (
                  <button
                    key={color}
                    id={`btn-variety-${color}`}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors capitalize cursor-pointer ${
                      selected
                        ? `${colorConfig.active} shadow-xs`
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${colorConfig.dot}`} />
                    {color}
                  </button>
                );
              })}
            </div>

            {/* Vietnam Season Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <span className="text-slate-400 pl-1.5 flex items-center gap-1 font-medium">
                <Sun className="h-3 w-3" />
                VN Crop:
              </span>
              <button
                id="btn-season-all"
                type="button"
                onClick={() => onFilterChange({ ...filters, selectedSeasons: [] })}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filters.selectedSeasons.length === 0
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {[1, 2, 3].map(s => {
                const selected = filters.selectedSeasons.includes(s);
                return (
                  <button
                    key={s}
                    id={`btn-season-${s}`}
                    type="button"
                    onClick={() => handleSeasonToggle(s)}
                    className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title={s === 1 ? 'Early Crop' : s === 2 ? 'Peak Harvest' : 'Late Season'}
                  >
                    S{s}
                  </button>
                );
              })}
            </div>

            {/* In-Season Only Origin Toggle */}
            <label className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                id="checkbox-in-season"
                type="checkbox"
                checked={filters.onlyInSeason}
                onChange={e => onFilterChange({ ...filters, onlyInSeason: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300"
              />
              <span className="text-slate-700 font-medium">Active Harvest Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Time Granularity Selector */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Clock className="h-3 w-3 text-slate-400 ml-1.5" />
              {(['weekly', 'monthly', 'yearly'] as TimeGranularity[]).map(g => (
                <button
                  key={g}
                  id={`btn-granularity-${g}`}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, granularity: g })}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                    filters.granularity === g
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-search-records"
                type="text"
                placeholder="Search dates, colors..."
                value={filters.searchQuery}
                onChange={e => onFilterChange({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
