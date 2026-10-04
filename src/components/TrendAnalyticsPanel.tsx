import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { CURRENCIES, formatCompactMoney, formatMoney, REGION_PROFILES } from '../data/vaultData';

interface TrendAnalyticsPanelProps {
  timeRange?: string;
  region?: string;
  currency?: string;
}

interface VolumeSpikeDataPoint {
  time: string;
  normalVolumeUSD: number;
  spikeVolumeUSD: number;
  totalVolumeUSD: number;
  authCount: number;
  isSpike: boolean;
  anomalyReason?: string;
}

export const TrendAnalyticsPanel: React.FC<TrendAnalyticsPanelProps> = ({
  timeRange = 'Last 24 hours',
  region = 'EU Payments',
  currency = 'USD',
}) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'spikes' | 'normal'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<VolumeSpikeDataPoint | null>(null);

  const currInfo = CURRENCIES[currency] || CURRENCIES.USD;
  const rate = currInfo.rate;
  const regionProfile = REGION_PROFILES[region] || REGION_PROFILES['EU Payments'];

  // Base multiplier depending on region
  const regionMultiplier =
    region === 'US Core'
      ? 1.5
      : region === 'APAC Cards'
      ? 1.2
      : region === 'Global Routing'
      ? 2.8
      : 1.0;

  // Generate volume spikes dataset mapped to timeRange
  const getDataset = (): VolumeSpikeDataPoint[] => {
    if (timeRange === 'Last 7 days') {
      return [
        {
          time: 'Mon',
          normalVolumeUSD: 140000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 140000 * regionMultiplier,
          authCount: 3120,
          isSpike: false,
        },
        {
          time: 'Tue',
          normalVolumeUSD: 165000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 165000 * regionMultiplier,
          authCount: 3840,
          isSpike: false,
        },
        {
          time: 'Wed',
          normalVolumeUSD: 155000 * regionMultiplier,
          spikeVolumeUSD: 125000 * regionMultiplier,
          totalVolumeUSD: 280000 * regionMultiplier,
          authCount: 6890,
          isSpike: true,
          anomalyReason: 'Card-Not-Present Velocity Burst: 420 auths in 3 mins on UK e-commerce portal',
        },
        {
          time: 'Thu',
          normalVolumeUSD: 172000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 172000 * regionMultiplier,
          authCount: 3950,
          isSpike: false,
        },
        {
          time: 'Fri',
          normalVolumeUSD: 190000 * regionMultiplier,
          spikeVolumeUSD: 160000 * regionMultiplier,
          totalVolumeUSD: 350000 * regionMultiplier,
          authCount: 8420,
          isSpike: true,
          anomalyReason: 'Cross-Border BIN Exhaustion attack across 14 European merchant accounts',
        },
        {
          time: 'Sat',
          normalVolumeUSD: 130000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 130000 * regionMultiplier,
          authCount: 2900,
          isSpike: false,
        },
        {
          time: 'Sun',
          normalVolumeUSD: 125000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 125000 * regionMultiplier,
          authCount: 2750,
          isSpike: false,
        },
      ];
    }

    if (timeRange === 'Last 30 days') {
      return [
        {
          time: 'Wk 1 (Sep 07)',
          normalVolumeUSD: 720000 * regionMultiplier,
          spikeVolumeUSD: 180000 * regionMultiplier,
          totalVolumeUSD: 900000 * regionMultiplier,
          authCount: 18200,
          isSpike: true,
          anomalyReason: 'Merchant Batch Settlement Spike (>2.2x expected baseline)',
        },
        {
          time: 'Wk 2 (Sep 14)',
          normalVolumeUSD: 780000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 780000 * regionMultiplier,
          authCount: 17400,
          isSpike: false,
        },
        {
          time: 'Wk 3 (Sep 21)',
          normalVolumeUSD: 750000 * regionMultiplier,
          spikeVolumeUSD: 240000 * regionMultiplier,
          totalVolumeUSD: 990000 * regionMultiplier,
          authCount: 22100,
          isSpike: true,
          anomalyReason: 'Multi-corridor automated card testing surge across APAC and EU rails',
        },
        {
          time: 'Wk 4 (Sep 28)',
          normalVolumeUSD: 810000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 810000 * regionMultiplier,
          authCount: 19100,
          isSpike: false,
        },
        {
          time: 'Live (Oct 03)',
          normalVolumeUSD: 690000 * regionMultiplier,
          spikeVolumeUSD: 195000 * regionMultiplier,
          totalVolumeUSD: 885000 * regionMultiplier,
          authCount: 20400,
          isSpike: true,
          anomalyReason: 'Current Active Triage: Elevated chargeback attempts from virtual card BINs',
        },
      ];
    }

    if (timeRange === 'Quarter to Date') {
      return [
        {
          time: 'July',
          normalVolumeUSD: 2400000 * regionMultiplier,
          spikeVolumeUSD: 420000 * regionMultiplier,
          totalVolumeUSD: 2820000 * regionMultiplier,
          authCount: 68400,
          isSpike: true,
          anomalyReason: 'Seasonal flash sales checkout spike + high velocity refund testing',
        },
        {
          time: 'August',
          normalVolumeUSD: 2650000 * regionMultiplier,
          spikeVolumeUSD: 0,
          totalVolumeUSD: 2650000 * regionMultiplier,
          authCount: 71200,
          isSpike: false,
        },
        {
          time: 'September',
          normalVolumeUSD: 2800000 * regionMultiplier,
          spikeVolumeUSD: 650000 * regionMultiplier,
          totalVolumeUSD: 3450000 * regionMultiplier,
          authCount: 84900,
          isSpike: true,
          anomalyReason: 'Quarter-end settlement rush + foreign exchange rate disparity exploitation',
        },
        {
          time: 'Q4 Live',
          normalVolumeUSD: 1400000 * regionMultiplier,
          spikeVolumeUSD: 210000 * regionMultiplier,
          totalVolumeUSD: 1610000 * regionMultiplier,
          authCount: 39500,
          isSpike: true,
          anomalyReason: 'Early Q4 volume expansion with elevated offshore authorizations',
        },
      ];
    }

    // Default: 'Last 24 hours' (hourly distribution)
    return [
      {
        time: '00:00',
        normalVolumeUSD: 28000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 28000 * regionMultiplier,
        authCount: 680,
        isSpike: false,
      },
      {
        time: '03:00',
        normalVolumeUSD: 18000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 18000 * regionMultiplier,
        authCount: 420,
        isSpike: false,
      },
      {
        time: '06:00',
        normalVolumeUSD: 34000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 34000 * regionMultiplier,
        authCount: 890,
        isSpike: false,
      },
      {
        time: '09:00',
        normalVolumeUSD: 72000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 72000 * regionMultiplier,
        authCount: 1820,
        isSpike: false,
      },
      {
        time: '12:00',
        normalVolumeUSD: 98000 * regionMultiplier,
        spikeVolumeUSD: 64000 * regionMultiplier,
        totalVolumeUSD: 162000 * regionMultiplier,
        authCount: 3940,
        isSpike: true,
        anomalyReason: 'Peak Lunchtime Velocity Surge: 184 rapid POS transactions on AU & EU debit rails',
      },
      {
        time: '15:00',
        normalVolumeUSD: 88000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 88000 * regionMultiplier,
        authCount: 2210,
        isSpike: false,
      },
      {
        time: '18:00',
        normalVolumeUSD: 110000 * regionMultiplier,
        spikeVolumeUSD: 82000 * regionMultiplier,
        totalVolumeUSD: 192000 * regionMultiplier,
        authCount: 4780,
        isSpike: true,
        anomalyReason: 'High-Risk BIN Range Spike: Sudden wave of cross-border card checkout attempts',
      },
      {
        time: '21:00',
        normalVolumeUSD: 82000 * regionMultiplier,
        spikeVolumeUSD: 0,
        totalVolumeUSD: 82000 * regionMultiplier,
        authCount: 1990,
        isSpike: false,
      },
      {
        time: 'Now',
        normalVolumeUSD: 74000 * regionMultiplier,
        spikeVolumeUSD: 38000 * regionMultiplier,
        totalVolumeUSD: 112000 * regionMultiplier,
        authCount: 2850,
        isSpike: true,
        anomalyReason: 'Active Ingestion Spike: E-commerce gateway monitoring incoming batch authorization',
      },
    ];
  };

  const rawData = getDataset();

  // Convert amounts to active currency
  const data = rawData.map((d) => ({
    ...d,
    totalVolume: d.totalVolumeUSD * rate,
    normalVolume: d.normalVolumeUSD * rate,
    spikeVolume: d.spikeVolumeUSD * rate,
  }));

  // Calculations
  const peakVolume = Math.max(...data.map((d) => d.totalVolume));
  const totalVolumeSum = data.reduce((acc, d) => acc + d.totalVolume, 0);
  const totalSpikes = data.filter((d) => d.isSpike).length;
  const avgBaseline =
    data.reduce((acc, d) => acc + d.normalVolume, 0) / (data.length || 1);

  // Dynamic anomaly threshold = 1.35 * avgBaseline
  const anomalyThreshold = avgBaseline * 1.35;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between select-none space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600 text-xl">
              monitoring
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Trend Analytics: Transaction Volume Spikes
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time algorithmic spike detection, velocity anomaly attribution, and baseline threshold monitoring
          </p>
        </div>

        {/* View Mode Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveMetric('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                activeMetric === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Volume
            </button>
            <button
              onClick={() => setActiveMetric('spikes')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activeMetric === 'spikes'
                  ? 'bg-white text-orange-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              <span>Spikes Only</span>
            </button>
            <button
              onClick={() => setActiveMetric('normal')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                activeMetric === 'normal'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baseline
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-sans block mb-0.5">Peak Volume Spike</span>
          <span className="font-bold text-slate-900 font-mono text-sm block">
            {formatCompactMoney(peakVolume / rate, currency)}
          </span>
          <span className="text-[10px] text-orange-600 font-mono">
            {currInfo.symbol}{(peakVolume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-sans block mb-0.5">Monitored Volume ({timeRange})</span>
          <span className="font-bold text-slate-900 font-mono text-sm block">
            {formatCompactMoney(totalVolumeSum / rate, currency)}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Nominal Flow Active</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-sans block mb-0.5">Spike Anomaly Bursts</span>
          <span className="font-bold text-orange-600 font-mono text-sm block">
            {totalSpikes} Detected Events
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Dynamic 1.35x Threshold</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-sans block mb-0.5">Scoring Engine Precision</span>
          <span className="font-bold text-emerald-600 font-mono text-sm block">
            99.2% Accuracy
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Latency &lt; 14ms</span>
        </div>
      </div>

      {/* Recharts Area Chart Viewport */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                setHoveredPoint(state.activePayload[0].payload as VolumeSpikeDataPoint);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              {/* Total Volume Gradient */}
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
              </linearGradient>

              {/* Spike Anomaly Red/Orange Gradient */}
              <linearGradient id="spikeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.05} />
              </linearGradient>

              {/* Normal Baseline Gradient */}
              <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => formatCompactMoney(val / rate, currency)}
              tick={{ fill: '#64748b', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const pt = payload[0].payload as VolumeSpikeDataPoint & {
                    totalVolume: number;
                    normalVolume: number;
                    spikeVolume: number;
                  };

                  return (
                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-mono space-y-2 max-w-xs animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-orange-400">{pt.time}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            pt.isSpike
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {pt.isSpike ? 'ANOMALY SPIKE' : 'NORMAL VELOCITY'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Total Volume:</span>
                          <span className="font-bold text-slate-100">
                            {formatMoney(pt.totalVolume / rate, currency)}
                          </span>
                        </div>
                        {pt.isSpike && (
                          <div className="flex justify-between text-orange-300">
                            <span className="font-sans">Spike Volume:</span>
                            <span className="font-bold">
                              +{formatMoney(pt.spikeVolume / rate, currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-400">
                          <span className="font-sans">Card Authorizations:</span>
                          <span>{pt.authCount.toLocaleString()} tx</span>
                        </div>
                      </div>

                      {pt.anomalyReason && (
                        <div className="pt-1.5 border-t border-slate-800 text-[10px] text-orange-300 leading-tight">
                          {pt.anomalyReason}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Reference Line for Dynamic Anomaly Threshold */}
            <ReferenceLine
              y={anomalyThreshold}
              stroke="#ea580c"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Spike Threshold: ${formatCompactMoney(anomalyThreshold / rate, currency)}`,
                position: 'insideTopRight',
                fill: '#ea580c',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Total / Baseline Volume Areas */}
            {(activeMetric === 'all' || activeMetric === 'normal') && (
              <Area
                type="monotone"
                dataKey={activeMetric === 'normal' ? 'normalVolume' : 'totalVolume'}
                name="Total Transaction Volume"
                stroke={activeMetric === 'normal' ? '#0f172a' : '#ea580c'}
                strokeWidth={2.4}
                fillOpacity={1}
                fill={activeMetric === 'normal' ? 'url(#normalGradient)' : 'url(#volumeGradient)'}
              />
            )}

            {/* Spike Component Highlight */}
            {(activeMetric === 'all' || activeMetric === 'spikes') && (
              <Area
                type="monotone"
                dataKey="spikeVolume"
                name="Spike Anomaly Burst"
                stroke="#dc2626"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spikeGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Spike Anomaly Callout Banner */}
      {hoveredPoint && hoveredPoint.isSpike ? (
        <div className="p-3 bg-red-50/80 border border-red-200/80 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-lg">crisis_alert</span>
            <div>
              <span className="font-bold text-red-950 block">
                Anomaly Spike at {hoveredPoint.time}: {hoveredPoint.anomalyReason}
              </span>
              <span className="text-[11px] text-red-700 block">
                Surge Volume: {formatMoney(hoveredPoint.spikeVolumeUSD, currency)} across {hoveredPoint.authCount} authorizations
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded text-[11px]">
            Flagged for Triage
          </span>
        </div>
      ) : (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dhoomketu Velocity Monitor • Hover over data points to inspect burst attributions</span>
          </div>
          <span>Region Scope: {region}</span>
        </div>
      )}

      {/* Legend & Telemetry Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-orange-500 shrink-0" />
            <span className="text-slate-700 font-medium">Total Volume Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-red-600 shrink-0" />
            <span className="text-slate-700 font-medium">Anomaly Burst Component</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-orange-600" />
            <span className="text-slate-700 font-medium">Dynamic Anomaly Threshold</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Engine: Recharts v2 • Vector Analytics Engine
        </div>
      </div>
    </div>
  );
};
