import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MetricCards } from './components/MetricCards';
import { PriceCorridorChart } from './components/PriceCorridorChart';
import { OriginVolumeChart } from './components/OriginVolumeChart';
import { SupplyDemandChart } from './components/SupplyDemandChart';
import { SeasonalityMatrix } from './components/SeasonalityMatrix';
import { VarietyComparison } from './components/VarietyComparison';
import { DataTable } from './components/DataTable';
import { RecordDetailModal } from './components/RecordDetailModal';

import { MarketRecord, DashboardFilters, DashboardTab, AggregatedPoint } from './types';
import { INITIAL_MARKET_DATA } from './utils/dataParser';
import { filterRecords, computeSummaryStats, aggregateTimelineData } from './utils/analytics';

export default function App() {
  const [allRecords, setAllRecords] = useState<MarketRecord[]>(INITIAL_MARKET_DATA);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [selectedRecord, setSelectedRecord] = useState<MarketRecord | null>(null);

  const [filters, setFilters] = useState<DashboardFilters>({
    selectedYears: [],
    selectedColors: [],
    selectedSeasons: [],
    onlyInSeason: false,
    searchQuery: '',
    granularity: 'weekly',
    priceMetric: 'price',
  });

  // Unique years in dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allRecords.map(r => r.year))).filter((y): y is number => typeof y === 'number' && !isNaN(y));
    return years.sort((a, b) => a - b);
  }, [allRecords]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(allRecords, filters);
  }, [allRecords, filters]);

  // Aggregated summary KPIs
  const summaryStats = useMemo(() => {
    return computeSummaryStats(filteredRecords);
  }, [filteredRecords]);

  // Time series aggregated data for Recharts
  const timelineData = useMemo(() => {
    return aggregateTimelineData(filteredRecords, filters.granularity);
  }, [filteredRecords, filters.granularity]);

  const handleResetFilters = () => {
    setFilters({
      selectedYears: [],
      selectedColors: [],
      selectedSeasons: [],
      onlyInSeason: false,
      searchQuery: '',
      granularity: 'weekly',
      priceMetric: 'price',
    });
  };

  const handleDataUpload = (newRecords: MarketRecord[]) => {
    setAllRecords(newRecords);
    handleResetFilters();
  };

  const handleSelectTimelinePoint = (point: AggregatedPoint) => {
    // Find matching record from filtered dataset for the clicked period
    const matched = filteredRecords.find(r => r.week_start_dt === point.date) || filteredRecords[0];
    if (matched) {
      setSelectedRecord(matched);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top App Header */}
      <Header
        records={filteredRecords}
        allRecordsCount={allRecords.length}
        filteredCount={filteredRecords.length}
        onDataUpload={handleDataUpload}
        onResetFilters={handleResetFilters}
      />

      {/* Interactive Global Filter & Navigation Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        availableYears={availableYears}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Executive KPI Cards (Always visible for immediate situational awareness) */}
        <MetricCards stats={summaryStats} />

        {/* Tab Specific Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <PriceCorridorChart
              data={timelineData}
              onSelectPoint={handleSelectTimelinePoint}
            />

            <OriginVolumeChart
              data={timelineData}
              stats={summaryStats}
              onSelectPoint={handleSelectTimelinePoint}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SupplyDemandChart
                data={timelineData}
                onSelectPoint={handleSelectTimelinePoint}
              />
              <VarietyComparison records={filteredRecords} />
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="space-y-6">
            <PriceCorridorChart
              data={timelineData}
              onSelectPoint={handleSelectTimelinePoint}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VarietyComparison records={filteredRecords} />
              <SupplyDemandChart
                data={timelineData}
                onSelectPoint={handleSelectTimelinePoint}
              />
            </div>
          </div>
        )}

        {activeTab === 'origins' && (
          <div className="space-y-6">
            <OriginVolumeChart
              data={timelineData}
              stats={summaryStats}
              onSelectPoint={handleSelectTimelinePoint}
            />
            <SeasonalityMatrix records={filteredRecords} />
          </div>
        )}

        {activeTab === 'supply-demand' && (
          <div className="space-y-6">
            <SupplyDemandChart
              data={timelineData}
              onSelectPoint={handleSelectTimelinePoint}
            />
            <PriceCorridorChart
              data={timelineData}
              onSelectPoint={handleSelectTimelinePoint}
            />
          </div>
        )}

        {activeTab === 'seasonality' && (
          <div className="space-y-6">
            <SeasonalityMatrix records={filteredRecords} />
          </div>
        )}

        {activeTab === 'varieties' && (
          <div className="space-y-6">
            <VarietyComparison records={filteredRecords} />
            <PriceCorridorChart
              data={timelineData}
              onSelectPoint={handleSelectTimelinePoint}
            />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="space-y-6">
            <DataTable
              records={filteredRecords}
              onSelectRecord={setSelectedRecord}
            />
          </div>
        )}
      </main>

      {/* Record Inspection Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
