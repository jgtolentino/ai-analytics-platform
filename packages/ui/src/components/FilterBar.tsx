// Filter Bar component for Scout Analytics
import { useState } from 'react';
import { Button } from './Button';
import { DateRangePicker, DateRange } from './DateRangePicker';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'text' | 'date';
  options?: FilterOption[];
  value?: any;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterBarProps {
  filters: FilterGroup[];
  onFiltersChange: (filters: { [key: string]: any }) => void;
  className?: string;
  compact?: boolean;
  showClearAll?: boolean;
  showApplyButton?: boolean;
  onSave?: (name: string, filters: { [key: string]: any }) => void;
  savedFilters?: Array<{ name: string; filters: { [key: string]: any } }>;
}

export function FilterBar({
  filters,
  onFiltersChange,
  className = '',
  compact = false,
  showClearAll = true,
  showApplyButton = false,
  onSave,
  savedFilters = []
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  const updateFilter = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    
    if (!showApplyButton) {
      onFiltersChange(newFilters);
    }
  };

  const handleApply = () => {
    onFiltersChange(activeFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  const handleSaveFilters = () => {
    if (saveName.trim() && onSave) {
      onSave(saveName.trim(), activeFilters);
      setSaveDialogOpen(false);
      setSaveName('');
    }
  };

  const loadSavedFilter = (savedFilter: { name: string; filters: { [key: string]: any } }) => {
    setActiveFilters(savedFilter.filters);
    onFiltersChange(savedFilter.filters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== null && value !== undefined && value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const renderFilter = (filter: FilterGroup) => {
    const value = activeFilters[filter.id] || filter.value;

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{filter.placeholder || `All ${filter.label}`}</option>
            {filter.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="relative">
            <select
              multiple
              value={value || []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                updateFilter(filter.id, selectedValues);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              size={Math.min(5, filter.options?.length || 3)}
            >
              {filter.options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'range':
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={value?.min || ''}
              onChange={(e) => updateFilter(filter.id, { ...value, min: e.target.value })}
              placeholder="Min"
              min={filter.min}
              max={filter.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={value?.max || ''}
              onChange={(e) => updateFilter(filter.id, { ...value, max: e.target.value })}
              placeholder="Max"
              min={filter.min}
              max={filter.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'date':
        return (
          <DateRangePicker
            value={value}
            onChange={(range) => updateFilter(filter.id, range)}
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'} ▼
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {showClearAll && getActiveFilterCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
              
              {onSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={getActiveFilterCount() === 0}
                >
                  Save Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {savedFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Saved:</span>
                  {savedFilters.map((saved, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedFilter(saved)}
                    >
                      {saved.name}
                    </Button>
                  ))}
                </div>
              )}

              {showApplyButton && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                >
                  Apply Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Save Filter Preset</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter preset name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveFilters}
                disabled={!saveName.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}