// Date Range Picker component for Scout Analytics
import { useState } from 'react';
import { Button } from './Button';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  disabled?: boolean;
  presets?: DateRangePreset[];
  maxDate?: Date;
  minDate?: Date;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

const defaultPresets: DateRangePreset[] = [
  {
    label: 'Last 7 days',
    range: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    label: 'Last 30 days',
    range: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    label: 'Last 90 days',
    range: {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    label: 'This month',
    range: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date()
    }
  },
  {
    label: 'Last month',
    range: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    }
  }
];

export function DateRangePicker({
  value,
  onChange,
  className = '',
  disabled = false,
  presets = defaultPresets,
  maxDate = new Date(),
  minDate
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.start || new Date());
  const [endDate, setEndDate] = useState(value?.end || new Date());

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleApply = () => {
    onChange({ start: startDate, end: endDate });
    setIsOpen(false);
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    setStartDate(preset.range.start);
    setEndDate(preset.range.end);
    onChange(preset.range);
    setIsOpen(false);
  };

  const displayText = value 
    ? `${formatDate(value.start)} - ${formatDate(value.end)}`
    : 'Select date range';

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between"
      >
        <span>{displayText}</span>
        <span className="ml-2">📅</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-96">
          {/* Presets */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Select</h4>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="justify-start text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h4>
            
            {/* Date inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formatDateInput(startDate)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  min={minDate ? formatDateInput(minDate) : undefined}
                  max={formatDateInput(endDate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formatDateInput(endDate)}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  min={formatDateInput(startDate)}
                  max={formatDateInput(maxDate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}