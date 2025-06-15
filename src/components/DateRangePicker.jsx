// DateRangePicker.jsx - Date Range Picker with Default Range
// Enhanced date picker with preset ranges and custom selection
// Default: 05/16/2025–06/15/2025 (30-day period)
// Version: 1.0.0

import React, { useState, useRef, useEffect } from 'react';

export default function DateRangePicker({ 
  onDateChange, 
  initialStartDate = '2025-05-16',
  initialEndDate = '2025-06-15',
  className = ''
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const dropdownRef = useRef(null);

  // Preset date ranges
  const presets = [
    {
      label: 'Last 7 Days',
      value: 'last7days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 30 Days',
      value: 'last30days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'This Month',
      value: 'thismonth',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last Month',
      value: 'lastmonth',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Default Range',
      value: 'default',
      getRange: () => ({
        start: '2025-05-16',
        end: '2025-06-15'
      })
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    const range = preset.getRange();
    setStartDate(range.start);
    setEndDate(range.end);
    setSelectedPreset(preset.value);
    
    if (onDateChange) {
      onDateChange({
        startDate: range.start,
        endDate: range.end,
        preset: preset.value
      });
    }
    
    setIsOpen(false);
  };

  // Handle custom date changes
  const handleDateChange = (field, value) => {
    if (field === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setSelectedPreset('custom');
  };

  // Apply custom date range
  const handleApply = () => {
    if (onDateChange) {
      onDateChange({
        startDate,
        endDate,
        preset: 'custom'
      });
    }
    setIsOpen(false);
  };

  // Calculate days difference
  const getDaysDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Date Range Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </span>
        <span className="sm:hidden">
          {getDaysDifference()} days
        </span>
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Select Date Range</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preset Options */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Quick Select</h4>
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedPreset === preset.value 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {preset.label}
                  {preset.value === 'default' && (
                    <span className="ml-2 text-xs text-blue-600 font-medium">Recommended</span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Date Selection */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-3">Custom Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Summary and Actions */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-600">
                  {getDaysDifference()} days selected
                </div>
                <div className="text-xs text-gray-600">
                  {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Range Indicator */}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></div>
    </div>
  );
}

// Utility function to get current default range
export const getDefaultDateRange = () => ({
  startDate: '2025-05-16',
  endDate: '2025-06-15',
  preset: 'default'
});

// Export for use in other components
export { DateRangePicker };