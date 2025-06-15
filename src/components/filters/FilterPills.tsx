// FilterPills.tsx - Enhanced filter component with TBWA branding
import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  isTBWA?: boolean;
}

interface FilterPillsProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  highlightTBWA?: boolean;
}

export default function FilterPills({
  label,
  options,
  selected,
  onChange,
  multiSelect = true,
  highlightTBWA = false
}: FilterPillsProps) {
  const toggleOption = (optionId: string) => {
    if (multiSelect) {
      const newSelected = selected.includes(optionId)
        ? selected.filter(id => id !== optionId)
        : [...selected, optionId];
      onChange(newSelected);
    } else {
      onChange(selected.includes(optionId) ? [] : [optionId]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="filter-pills">
        {options.map(option => {
          const isSelected = selected.includes(option.id);
          const isTBWABrand = highlightTBWA && option.isTBWA;
          
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`
                filter-pill
                ${isSelected ? 'filter-pill-active' : 'filter-pill-inactive'}
                ${isTBWABrand ? 'pill-tbwa' : ''}
              `}
            >
              {option.label}
              {isTBWABrand && (
                <span className="ml-1 text-xs">⭐</span>
              )}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {selected.length} selected
          {multiSelect && (
            <button
              onClick={() => onChange([])}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}