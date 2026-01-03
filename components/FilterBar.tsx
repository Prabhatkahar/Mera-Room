import React from 'react';
import { ALL_AMENITIES, SortOption } from '../types';
import { X, RefreshCw, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  isVisible: boolean;
  minPrice: number | '';
  maxPrice: number | '';
  setMinPrice: (val: number | '') => void;
  setMaxPrice: (val: number | '') => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onClear: () => void;
  onClose: () => void;
}

const PRICE_PRESETS = [
  { label: 'Under ₹10k', min: '' as const, max: 10000 },
  { label: '₹10k - ₹20k', min: 10000, max: 20000 },
  { label: '₹20k - ₹30k', min: 20000, max: 30000 },
  { label: 'Above ₹30k', min: 30000, max: '' as const },
];

const FilterBar: React.FC<FilterBarProps> = ({
  isVisible,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedAmenities,
  toggleAmenity,
  sortOption,
  setSortOption,
  onClear,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Filters & Sort
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="RELEVANCE">Relevance (Default)</option>
            <option value="NEWEST">Newest First</option>
            <option value="PRICE_LOW_HIGH">Price: Low to High</option>
            <option value="PRICE_HIGH_LOW">Price: High to Low</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Price Range (₹)
          </label>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          
          {/* Quick Price Presets */}
          <div className="flex flex-wrap gap-2">
            {PRICE_PRESETS.map((preset, idx) => {
              const isActive = minPrice === preset.min && maxPrice === preset.max;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isActive) {
                      setMinPrice('');
                      setMaxPrice('');
                    } else {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;