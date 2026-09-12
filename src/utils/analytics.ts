import { MarketRecord, DashboardFilters, AggregatedPoint, SummaryStats } from '../types';

/**
 * Filter records according to user criteria
 */
export function filterRecords(records: MarketRecord[], filters: DashboardFilters): MarketRecord[] {
  return records.filter(record => {
    // Year filter
    if (filters.selectedYears.length > 0 && !filters.selectedYears.includes(record.year)) {
      return false;
    }

    // Color filter
    if (filters.selectedColors.length > 0 && !filters.selectedColors.includes(record.p_color)) {
      return false;
    }

    // Season filter
    if (filters.selectedSeasons.length > 0 && !filters.selectedSeasons.includes(record.vietnam_season)) {
      return false;
    }

    // Only in-season filter
    if (filters.onlyInSeason) {
      const anyInSeason = record.brazil_season || record.indonesia_season || record.india_season || record.china_season;
      if (!anyInSeason) return false;
    }

    // Search query (date, year, month, color)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        record.week_start_dt.toLowerCase().includes(q) ||
        record.p_color.toLowerCase().includes(q) ||
        record.year.toString().includes(q) ||
        `season ${record.vietnam_season}`.includes(q);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Compute executive summary statistics
 */
export function computeSummaryStats(records: MarketRecord[]): SummaryStats {
  if (records.length === 0) {
    return {
      recordCount: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      totalVolume: 0,
      avgWeeklyVolume: 0,
      avgDemand: 0,
      avgSupply: 0,
      topOriginCountry: 'Vietnam',
      topOriginVolume: 0,
      topOriginSharePct: 0,
      vietnamSharePct: 0,
      brazilSharePct: 0,
      indiaSharePct: 0,
      indonesiaSharePct: 0,
      chinaSharePct: 0,
    };
  }

  let totalPrice = 0;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let totalDemand = 0;
  let totalSupply = 0;

  // We must be careful: each weekly date has up to 3 records (one for each color).
  // Total volume and country exports are recorded per week, so we can track unique weeks or compute appropriately.
  // We'll compute totalVolume by unique week_start_dt to avoid triple-counting weekly container shipments.
  const weekVolumeMap = new Map<string, { total: number; vn: number; br: number; in: number; id: number; cn: number }>();

  records.forEach(r => {
    totalPrice += r.price;
    if (r.price < minPrice) minPrice = r.price;
    if (r.price > maxPrice) maxPrice = r.price;
    totalDemand += r.demand;
    totalSupply += r.supply;

    if (!weekVolumeMap.has(r.week_start_dt)) {
      weekVolumeMap.set(r.week_start_dt, {
        total: r.total_volume,
        vn: r.vietnam,
        br: r.brazil,
        in: r.india,
        id: r.indonesia,
        cn: r.china,
      });
    }
  });

  let totalVolume = 0;
  let vnTotal = 0;
  let brTotal = 0;
  let inTotal = 0;
  let idTotal = 0;
  let cnTotal = 0;

  weekVolumeMap.forEach(v => {
    totalVolume += v.total;
    vnTotal += v.vn;
    brTotal += v.br;
    inTotal += v.in;
    idTotal += v.id;
    cnTotal += v.cn;
  });

  const countryTotals = [
    { country: 'Vietnam', vol: vnTotal },
    { country: 'Brazil', vol: brTotal },
    { country: 'Indonesia', vol: idTotal },
    { country: 'India', vol: inTotal },
    { country: 'China', vol: cnTotal },
  ].sort((a, b) => b.vol - a.vol);

  const topOrigin = countryTotals[0];
  const denom = totalVolume > 0 ? totalVolume : 1;

  return {
    recordCount: records.length,
    avgPrice: totalPrice / records.length,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice: maxPrice === -Infinity ? 0 : maxPrice,
    totalVolume,
    avgWeeklyVolume: weekVolumeMap.size > 0 ? totalVolume / weekVolumeMap.size : 0,
    avgDemand: totalDemand / records.length,
    avgSupply: totalSupply / records.length,
    topOriginCountry: topOrigin.country,
    topOriginVolume: topOrigin.vol,
    topOriginSharePct: (topOrigin.vol / denom) * 100,
    vietnamSharePct: (vnTotal / denom) * 100,
    brazilSharePct: (brTotal / denom) * 100,
    indiaSharePct: (inTotal / denom) * 100,
    indonesiaSharePct: (idTotal / denom) * 100,
    chinaSharePct: (cnTotal / denom) * 100,
  };
}

/**
 * Aggregates time-series data for recharts depending on granularity
 */
export function aggregateTimelineData(records: MarketRecord[], granularity: 'weekly' | 'monthly' | 'yearly'): AggregatedPoint[] {
  if (records.length === 0) return [];

  // Group by key
  const groups = new Map<string, MarketRecord[]>();

  // Sort ascending by date
  const sorted = [...records].sort((a, b) => a.week_start_dt.localeCompare(b.week_start_dt));

  sorted.forEach(r => {
    let key = r.week_start_dt;
    if (granularity === 'monthly') {
      key = `${r.year}-${String(r.month).padStart(2, '0')}`;
    } else if (granularity === 'yearly') {
      key = `${r.year}`;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(r);
  });

  const result: AggregatedPoint[] = [];

  groups.forEach((groupRecords, key) => {
    let priceSum = 0;
    let minP = Infinity;
    let maxP = -Infinity;
    let jMaxSum = 0;
    let jMinSum = 0;
    let demandSum = 0;
    let supplySum = 0;

    let greenPrices: number[] = [];
    let redPrices: number[] = [];
    let yellowPrices: number[] = [];

    // Unique weeks for accurate volume sum
    const weekMap = new Map<string, MarketRecord>();

    groupRecords.forEach(r => {
      priceSum += r.price;
      if (r.price < minP) minP = r.price;
      if (r.price > maxP) maxP = r.price;
      jMaxSum += r.jordan_max_price;
      jMinSum += r.jordan_min_price;
      demandSum += r.demand;
      supplySum += r.supply;

      if (r.p_color === 'green') greenPrices.push(r.price);
      if (r.p_color === 'red') redPrices.push(r.price);
      if (r.p_color === 'yellow') yellowPrices.push(r.price);

      if (!weekMap.has(r.week_start_dt)) {
        weekMap.set(r.week_start_dt, r);
      }
    });

    let vol = 0;
    let vn = 0;
    let br = 0;
    let in_ = 0;
    let id_ = 0;
    let cn = 0;

    weekMap.forEach(wr => {
      vol += wr.total_volume;
      vn += wr.vietnam;
      br += wr.brazil;
      in_ += wr.india;
      id_ += wr.indonesia;
      cn += wr.china;
    });

    const count = groupRecords.length;
    const avgPrice = priceSum / count;
    const jordanMax = jMaxSum / count;
    const jordanMin = jMinSum / count;

    let displayLabel = key;
    if (granularity === 'monthly') {
      const [y, m] = key.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      displayLabel = `${monthNames[parseInt(m, 10) - 1]} '${y.slice(2)}`;
    } else if (granularity === 'weekly') {
      displayLabel = key.slice(5); // MM-DD
    }

    const avgGreen = greenPrices.length ? greenPrices.reduce((a, b) => a + b, 0) / greenPrices.length : undefined;
    const avgRed = redPrices.length ? redPrices.reduce((a, b) => a + b, 0) / redPrices.length : undefined;
    const avgYellow = yellowPrices.length ? yellowPrices.reduce((a, b) => a + b, 0) / yellowPrices.length : undefined;

    result.push({
      periodKey: key,
      displayLabel,
      date: groupRecords[0].week_start_dt,
      avgPrice: Number(avgPrice.toFixed(4)),
      minPrice: Number(minP.toFixed(4)),
      maxPrice: Number(maxP.toFixed(4)),
      jordanMax: Number(jordanMax.toFixed(4)),
      jordanMin: Number(jordanMin.toFixed(4)),
      spread: Number((jordanMax - jordanMin).toFixed(4)),
      totalVolume: Math.round(vol),
      vietnamVolume: Math.round(vn),
      brazilVolume: Math.round(br),
      indiaVolume: Math.round(in_),
      indonesiaVolume: Math.round(id_),
      chinaVolume: Math.round(cn),
      demand: Number((demandSum / count).toFixed(2)),
      supply: Number((supplySum / count).toFixed(2)),
      marketBalance: Number(((demandSum - supplySum) / count).toFixed(2)),
      recordCount: count,
      greenPrice: avgGreen ? Number(avgGreen.toFixed(4)) : undefined,
      redPrice: avgRed ? Number(avgRed.toFixed(4)) : undefined,
      yellowPrice: avgYellow ? Number(avgYellow.toFixed(4)) : undefined,
    });
  });

  return result;
}

/**
 * Breakdown comparison by Product Variety (Green, Red, Yellow)
 */
export function computeVarietyComparison(records: MarketRecord[]) {
  const varieties = ['green', 'red', 'yellow'] as const;
  
  return varieties.map(color => {
    const subset = records.filter(r => r.p_color === color);
    if (subset.length === 0) {
      return {
        color,
        count: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgDemand: 0,
        avgSupply: 0,
        avgSpread: 0,
      };
    }

    let pSum = 0;
    let minP = Infinity;
    let maxP = -Infinity;
    let dSum = 0;
    let sSum = 0;
    let spreadSum = 0;

    subset.forEach(r => {
      pSum += r.price;
      if (r.price < minP) minP = r.price;
      if (r.price > maxP) maxP = r.price;
      dSum += r.demand;
      sSum += r.supply;
      spreadSum += (r.jordan_max_price - r.jordan_min_price);
    });

    return {
      color,
      count: subset.length,
      avgPrice: Number((pSum / subset.length).toFixed(3)),
      minPrice: Number(minP.toFixed(3)),
      maxPrice: Number(maxP.toFixed(3)),
      avgDemand: Number((dSum / subset.length).toFixed(2)),
      avgSupply: Number((sSum / subset.length).toFixed(2)),
      avgSpread: Number((spreadSum / subset.length).toFixed(3)),
    };
  });
}

/**
 * Breakdown by Vietnam Season (1, 2, 3)
 */
export function computeSeasonAnalysis(records: MarketRecord[]) {
  const seasons = [1, 2, 3];
  return seasons.map(seasonNum => {
    const subset = records.filter(r => r.vietnam_season === seasonNum);
    if (subset.length === 0) {
      return {
        season: seasonNum,
        name: `Season ${seasonNum}`,
        records: 0,
        avgPrice: 0,
        avgVolume: 0,
        avgDemand: 0,
        avgSupply: 0,
      };
    }

    const priceSum = subset.reduce((acc, r) => acc + r.price, 0);
    const demandSum = subset.reduce((acc, r) => acc + r.demand, 0);
    const supplySum = subset.reduce((acc, r) => acc + r.supply, 0);

    const weekSet = new Set<string>();
    let volSum = 0;
    subset.forEach(r => {
      if (!weekSet.has(r.week_start_dt)) {
        weekSet.add(r.week_start_dt);
        volSum += r.total_volume;
      }
    });

    return {
      season: seasonNum,
      name: seasonNum === 1 ? 'Early Crop (S1)' : seasonNum === 2 ? 'Peak Harvest (S2)' : 'Late Season (S3)',
      records: subset.length,
      avgPrice: Number((priceSum / subset.length).toFixed(3)),
      avgVolume: Math.round(volSum / (weekSet.size || 1)),
      avgDemand: Number((demandSum / subset.length).toFixed(2)),
      avgSupply: Number((supplySum / subset.length).toFixed(2)),
    };
  });
}

/**
 * Monthly seasonality patterns across all years (Months 1 to 12)
 */
export function computeMonthlySeasonality(records: MarketRecord[]) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return monthNames.map((name, idx) => {
    const monthNum = idx + 1;
    const subset = records.filter(r => r.month === monthNum);
    if (subset.length === 0) {
      return {
        month: monthNum,
        monthName: name,
        avgPrice: 0,
        avgVolume: 0,
        avgDemand: 0,
        avgSupply: 0,
        activeOrigins: 0,
      };
    }

    const priceSum = subset.reduce((a, b) => a + b.price, 0);
    const demandSum = subset.reduce((a, b) => a + b.demand, 0);
    const supplySum = subset.reduce((a, b) => a + b.supply, 0);

    const weekMap = new Map<string, number>();
    subset.forEach(r => {
      if (!weekMap.has(r.week_start_dt)) {
        weekMap.set(r.week_start_dt, r.total_volume);
      }
    });

    let vol = 0;
    weekMap.forEach(v => { vol += v; });

    return {
      month: monthNum,
      monthName: name,
      avgPrice: Number((priceSum / subset.length).toFixed(3)),
      avgVolume: Math.round(vol / (weekMap.size || 1)),
      avgDemand: Number((demandSum / subset.length).toFixed(2)),
      avgSupply: Number((supplySum / subset.length).toFixed(2)),
    };
  });
}

/**
 * Format currency
 */
export function formatCurrency(val: number): string {
  return `$${val.toFixed(2)}`;
}

/**
 * Format volume (thousands or millions)
 */
export function formatVolume(val: number): string {
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(1)}k`;
  }
  return val.toLocaleString();
}
