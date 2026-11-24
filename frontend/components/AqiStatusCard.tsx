import React from 'react';
import { 
  CloudFog, 
  Wind, 
  Thermometer, 
  Droplets, 
  ExternalLink, 
  Layers, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Trees,
  Crosshair,
  Radio
} from 'lucide-react';
import { CityAirData, AqiCategory } from '../types';

interface AqiStatusCardProps {
  airData: CityAirData;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AqiStatusCard: React.FC<AqiStatusCardProps> = ({ airData, isLoading, onRefresh }) => {
  const getCategoryDetails = (cat: AqiCategory, aqi: number) => {
    if (aqi <= 50) {
      return {
        label: 'Good Air',
        bg: 'from-emerald-950/60 to-emerald-900/30 border-emerald-500/40 text-emerald-400',
        badge: 'bg-emerald-500 text-slate-950',
        advice: 'Safe for all normal outdoor activities and unsealed ventilation.'
      };
    }
    if (aqi <= 100) {
      return {
        label: 'Moderate',
        bg: 'from-amber-950/50 to-amber-900/20 border-amber-500/40 text-amber-400',
        badge: 'bg-amber-500 text-slate-950',
        advice: 'Sensitive individuals should limit prolonged heavy outdoor exertion.'
      };
    }
    if (aqi <= 150) {
      return {
        label: 'Unhealthy for Sensitive Groups',
        bg: 'from-orange-950/50 to-orange-900/20 border-orange-500/40 text-orange-400',
        badge: 'bg-orange-500 text-slate-950',
        advice: 'Children, asthmatics, and seniors should move workouts indoors.'
      };
    }
    if (aqi <= 200) {
      return {
        label: 'Unhealthy Smog',
        bg: 'from-rose-950/60 to-rose-900/30 border-rose-500/40 text-rose-400',
        badge: 'bg-rose-500 text-slate-950',
        advice: 'Everyone starts to experience symptoms; wear fitted N95 outdoors.'
      };
    }
    if (aqi <= 300) {
      return {
        label: 'Very Unhealthy',
        bg: 'from-purple-950/70 to-purple-900/30 border-purple-500/40 text-purple-300',
        badge: 'bg-purple-500 text-white',
        advice: 'Severe respiratory risk. Keep all windows sealed and purifiers active.'
      };
    }
    return {
      label: 'Hazardous Emergency',
      bg: 'from-red-950/80 via-slate-950 to-purple-950/60 border-red-500/50 text-red-400',
      badge: 'bg-red-600 text-white animate-pulse',
      advice: 'Critical winter inversion trap! Avoid outdoor exposure entirely.'
    };
  };

  const status = getCategoryDetails(airData.category, airData.aqi);

  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${status.bg} p-6 sm:p-7 shadow-2xl transition-all`}>
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none bg-emerald-400" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {airData.city}
            </h1>
            {airData.district && (
              <span className="text-sm font-semibold text-emerald-300 px-2.5 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-800/60">
                {airData.district}
              </span>
            )}
            <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
              {airData.country}
            </span>
            {airData.locationSource === 'gps' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-950 px-2 py-0.5 rounded-md border border-teal-800">
                <Crosshair className="w-3 h-3 text-teal-400" />
                Live GPS
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-1.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Observed: {airData.lastUpdated}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            {airData.monitoringStation && (
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Radio className="w-3 h-3 text-emerald-400" />
                Sensor: {airData.monitoringStation}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${status.badge}`}>
            {status.label}
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all text-xs flex items-center gap-1.5"
            title="Refresh current air readings"
          >
            <CloudFog className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5">
        {/* AQI Big Stat */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            Local Ambient AQI
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
              {airData.aqi}
            </span>
            <span className="text-xs font-semibold uppercase text-slate-400">US AQI</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (airData.aqi / 400) * 100)}%`,
                backgroundColor: airData.aqi > 200 ? '#f43f5e' : airData.aqi > 100 ? '#f59e0b' : '#10b981'
              }}
            />
          </div>
        </div>

        {/* PM2.5 Fine Particles */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            PM2.5 Concentration
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-rose-300">
              {airData.pm25}
            </span>
            <span className="text-xs font-semibold text-slate-400">µg/m³</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {(airData.pm25 / 15).toFixed(1)}x over WHO 24h safe limit
          </p>
        </div>

        {/* Inversion Risk */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Thermal Inversion Risk
          </span>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-300">
              {airData.inversionRisk}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Atmosphere trapping smoke near surface
          </p>
        </div>

        {/* Micro-climate */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-teal-400" />
            Weather & Inversion Vector
          </span>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-200">
              {airData.temperatureC}°C
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              {airData.humidity}% RH
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            High humidity worsens particle agglomeration
          </p>
        </div>
      </div>

      {/* Summary statement with Micro-Location Callout */}
      <div className="bg-slate-950/60 border border-slate-800/70 rounded-2xl p-4 my-2">
        <p className="text-sm text-slate-200 leading-relaxed font-normal">
          <span className="font-semibold text-emerald-400 mr-1.5">Atmospheric Insight:</span>
          {airData.summary}
        </p>

        {/* Micro-climate sanctuary notice */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-300">
          <Trees className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Micro-Climate Note:</strong> In {airData.city}, botanical parks and tree canopies reduce particulate concentrations by up to <strong>35%</strong>, while filtered institutional buildings offer up to <strong>85% cleaner air</strong> than outdoor roadways.
          </span>
        </div>

        {/* Dominant drivers */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Primary Smog Drivers:
          </span>
          {airData.dominantSources.map((source, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      {/* Google Search Grounding Sources citations */}
      {airData.sources && airData.sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Live Grounded Sources:
          </span>
          {airData.sources.map((src, idx) => (
            <a
              key={idx}
              href={src.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 text-teal-300 hover:text-teal-200 border border-slate-700/80 hover:border-teal-500/50 transition-colors text-[11px]"
            >
              <span>{src.title.length > 28 ? src.title.slice(0, 28) + '...' : src.title}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
