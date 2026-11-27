import React, { useState } from 'react';
import { Search, MapPin, RefreshCw, AlertTriangle, Compass, Radio, Crosshair } from 'lucide-react';
import { PRESET_CITIES } from '../services/geminiService';
import { Coordinates } from '../types';

interface LocationSelectorProps {
  currentCity: string;
  onSelectCity: (cityName: string) => void;
  onSelectCoordinates: (coords: Coordinates) => void;
  currentCoords?: Coordinates;
  isLoading: boolean;
  locationSource?: 'gps' | 'search' | 'preset';
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentCity,
  onSelectCity,
  onSelectCoordinates,
  currentCoords,
  isLoading,
  locationSource
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setGeoError(null);
      onSelectCity(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        onSelectCoordinates({
          latitude,
          longitude,
          accuracyMeters: Math.round(accuracy)
        });
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please enable GPS in browser permissions or type your town above.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information is currently unavailable. Try searching your city name.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please try again.');
            break;
          default:
            setGeoError('An unknown error occurred while requesting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              Target Location & GPS Sensor
            </h2>
            {locationSource === 'gps' && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse motion-reduce:animate-none">
                <Radio className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                Live GPS Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pinpoint real-time winter smog using device geolocation or search any town/city worldwide.
          </p>
        </div>

        {/* Action Controls: GPS Detect + Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* GPS Auto-Detect Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLoading || isLocating}
            aria-pressed={locationSource === 'gps'}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border whitespace-nowrap ${
              locationSource === 'gps'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-950'
            }`}
            title="Detect precise latitude/longitude for accurate local AQI"
          >
            {isLocating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span>Acquiring GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                <span>Use Exact Location</span>
              </>
            )}
          </button>

          {/* Search input form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2" role="search" aria-label="Search city or town air quality">
            <div className="relative flex-1 sm:w-64">
              <label htmlFor="city-search-input" className="sr-only">
                Search town, district, or city
              </label>
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="city-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search town, district, or city..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all border border-slate-700"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin motion-reduce:animate-none text-emerald-400" aria-hidden="true" />
              ) : (
                <Search className="w-4 h-4" aria-hidden="true" />
              )}
              <span>Find</span>
            </button>
          </form>
        </div>
      </div>

      {/* Geolocation error banner if any */}
      {geoError && (
        <div role="alert" className="mb-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" aria-hidden="true" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Live GPS Coordinates banner */}
      {currentCoords && locationSource === 'gps' && (
        <div className="mb-3.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            <span className="font-mono text-emerald-300">
              {currentCoords.latitude.toFixed(4)}°N, {currentCoords.longitude.toFixed(4)}°E
            </span>
            {currentCoords.accuracyMeters && (
              <span className="text-slate-400 font-sans">
                (Accurate to ~{currentCoords.accuracyMeters}m radius)
              </span>
            )}
          </div>
          <span className="text-slate-400">
            Ground-monitored micro-climate enabled
          </span>
        </div>
      )}

      {/* Preset popular winter smog hotspots */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800" role="group" aria-label="Monitored winter smog hotspots">
        <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap mr-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          Monitored Hotspots:
        </span>
        {PRESET_CITIES.map((item) => {
          const isSelected = locationSource !== 'gps' && currentCity.toLowerCase().includes(item.city.toLowerCase());
          return (
            <button
              key={item.city}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setGeoError(null);
                onSelectCity(item.city);
              }}
              disabled={isLoading}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border-slate-800 hover:border-slate-700'
              }`}
            >
              {item.city}
            </button>
          );
        })}
      </div>
    </div>
  );
};
