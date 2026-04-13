import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PropertyFilters, PROPERTY_TYPES, TRANSACTION_TYPES, MANDAT_STATUSES } from '../types/property';

interface FilterBarProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  resultCount: number;
}

const defaultFilters: PropertyFilters = {
  type: '',
  transaction: '',
  prix_min: '',
  prix_max: '',
  localisation: '',
  statut_mandat: '',
};

export function FilterBar({ filters, onFilterChange, resultCount }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const update = (key: keyof PropertyFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const reset = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#0f2552]" />
          <span className="text-sm font-semibold text-[#0f2552]">Filtres</span>
          {hasActiveFilters && (
            <span className="bg-[#2563eb] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Actifs
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{resultCount} résultat{resultCount !== 1 ? 's' : ''}</span>
          {hasActiveFilters && (
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              <X size={12} />
              Réinitialiser
            </button>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Type de bien
            </label>
            <select
              value={filters.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50"
            >
              <option value="">Tous les types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Transaction
            </label>
            <select
              value={filters.transaction}
              onChange={(e) => update('transaction', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50"
            >
              <option value="">Toutes</option>
              {TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Statut mandat
            </label>
            <select
              value={filters.statut_mandat}
              onChange={(e) => update('statut_mandat', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50"
            >
              <option value="">Tous les statuts</option>
              {MANDAT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Ville / Région
            </label>
            <input
              type="text"
              value={filters.localisation}
              onChange={(e) => update('localisation', e.target.value)}
              placeholder="Ex: Casablanca, Rabat..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Prix min (MAD)
            </label>
            <input
              type="number"
              value={filters.prix_min}
              onChange={(e) => update('prix_min', e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Prix max (MAD)
            </label>
            <input
              type="number"
              value={filters.prix_max}
              onChange={(e) => update('prix_max', e.target.value)}
              placeholder="Illimité"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50 placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
