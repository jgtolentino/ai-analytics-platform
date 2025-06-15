// DetailedDemographicsTable.tsx - Zebra-striped Demographics Table with Responsive Scroll
// Comprehensive demographic breakdown with enhanced styling and mobile support
// Version: 1.0.0

import React, { useState } from 'react';

interface DemographicData {
  ageGroup: string;
  gender: string;
  customerCount: number;
  avgSpend: number;
  frequency: number;
  preferredCategories: string[];
  location: string;
  incomeLevel: string;
  loyaltyScore: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  lastPurchase: string;
}

interface DetailedDemographicsTableProps {
  data: DemographicData[];
  className?: string;
}

export default function DetailedDemographicsTable({ 
  data, 
  className = "" 
}: DetailedDemographicsTableProps) {
  const [sortField, setSortField] = useState<keyof DemographicData>('customerCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return '🚨';
      case 'Medium': return '⚠️';
      case 'Low': return '✅';
      default: return '❓';
    }
  };

  const getLoyaltyColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoyaltyIcon = (score: number) => {
    if (score >= 8) return '💎';
    if (score >= 6) return '⭐';
    return '📋';
  };

  const handleSort = (field: keyof DemographicData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: keyof DemographicData) => {
    if (sortField !== field) return '⚪';
    return sortDirection === 'asc' ? '🔼' : '🔽';
  };

  // Filter and sort data
  const filteredData = data
    .filter(item => 
      (filterGender === 'all' || item.gender === filterGender) &&
      (filterAgeGroup === 'all' || item.ageGroup === filterAgeGroup)
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

  // Get unique values for filters
  const uniqueGenders = Array.from(new Set(data.map(d => d.gender)));
  const uniqueAgeGroups = Array.from(new Set(data.map(d => d.ageGroup)));

  return (
    <div className={`detailed-demographics-table bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detailed Demographics</h3>
            <p className="text-sm text-gray-600">Customer demographic analysis with behavioral insights</p>
          </div>
          <div className="text-sm text-gray-500">
            {formatNumber(filteredData.length)} of {formatNumber(data.length)} customers
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genders</option>
              {uniqueGenders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Age Group</label>
            <select
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ages</option>
              {uniqueAgeGroups.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          
          {(filterGender !== 'all' || filterAgeGroup !== 'all') && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterGender('all');
                  setFilterAgeGroup('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Container with Responsive Scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('ageGroup')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Age Group
                  <span className="ml-1">{getSortIcon('ageGroup')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('gender')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Gender
                  <span className="ml-1">{getSortIcon('gender')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('customerCount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Customers
                  <span className="ml-1">{getSortIcon('customerCount')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('avgSpend')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Avg Spend
                  <span className="ml-1">{getSortIcon('avgSpend')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('frequency')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Frequency
                  <span className="ml-1">{getSortIcon('frequency')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Categories
              </th>
              <th
                onClick={() => handleSort('location')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Location
                  <span className="ml-1">{getSortIcon('location')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('loyaltyScore')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Loyalty
                  <span className="ml-1">{getSortIcon('loyaltyScore')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('churnRisk')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Churn Risk
                  <span className="ml-1">{getSortIcon('churnRisk')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((demo, index) => (
              <tr 
                key={index} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {demo.ageGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="mr-1">{demo.gender === 'Male' ? '👨' : '👩'}</span>
                  {demo.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {formatNumber(demo.customerCount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(demo.avgSpend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {demo.frequency}x/month
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {demo.preferredCategories.slice(0, 2).map((category, catIndex) => (
                      <span 
                        key={catIndex}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {demo.preferredCategories.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{demo.preferredCategories.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  📍 {demo.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className={`mr-1 ${getLoyaltyColor(demo.loyaltyScore)}`}>
                      {getLoyaltyIcon(demo.loyaltyScore)}
                    </span>
                    <span className={`font-medium ${getLoyaltyColor(demo.loyaltyScore)}`}>
                      {demo.loyaltyScore}/10
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(demo.churnRisk)}`}>
                    <span className="mr-1">{getRiskIcon(demo.churnRisk)}</span>
                    {demo.churnRisk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(filteredData.reduce((sum, d) => sum + d.customerCount, 0))}
            </div>
            <div className="text-xs text-gray-600">Total Customers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(filteredData.reduce((sum, d) => sum + (d.avgSpend * d.customerCount), 0) / filteredData.reduce((sum, d) => sum + d.customerCount, 0) || 0)}
            </div>
            <div className="text-xs text-gray-600">Avg Spend</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {(filteredData.reduce((sum, d) => sum + d.loyaltyScore, 0) / filteredData.length || 0).toFixed(1)}/10
            </div>
            <div className="text-xs text-gray-600">Avg Loyalty</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {((filteredData.filter(d => d.churnRisk === 'Low').length / filteredData.length) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Low Risk</div>
          </div>
        </div>
      </div>

      {/* Mobile responsive note */}
      <div className="p-4 bg-blue-50 text-xs text-blue-700 md:hidden">
        💡 Scroll horizontally to view all columns
      </div>
    </div>
  );
}

// Sample data for development
export const sampleDemographicsData: DemographicData[] = [
  {
    ageGroup: '25-34',
    gender: 'Female',
    customerCount: 2340,
    avgSpend: 4250,
    frequency: 3.2,
    preferredCategories: ['Beauty', 'Fashion', 'Electronics'],
    location: 'Metro Manila',
    incomeLevel: 'Middle',
    loyaltyScore: 8.2,
    churnRisk: 'Low',
    lastPurchase: '2024-01-10'
  },
  {
    ageGroup: '35-44',
    gender: 'Male',
    customerCount: 1897,
    avgSpend: 3890,
    frequency: 2.8,
    preferredCategories: ['Electronics', 'Automotive', 'Sports'],
    location: 'Cebu',
    incomeLevel: 'Upper Middle',
    loyaltyScore: 7.5,
    churnRisk: 'Low',
    lastPurchase: '2024-01-12'
  },
  {
    ageGroup: '18-24',
    gender: 'Female',
    customerCount: 1654,
    avgSpend: 2150,
    frequency: 4.1,
    preferredCategories: ['Fashion', 'Food', 'Entertainment'],
    location: 'Davao',
    incomeLevel: 'Lower Middle',
    loyaltyScore: 6.8,
    churnRisk: 'Medium',
    lastPurchase: '2024-01-08'
  },
  {
    ageGroup: '45-54',
    gender: 'Male',
    customerCount: 1423,
    avgSpend: 5670,
    frequency: 2.1,
    preferredCategories: ['Home', 'Automotive', 'Health'],
    location: 'Baguio',
    incomeLevel: 'Upper Middle',
    loyaltyScore: 9.1,
    churnRisk: 'Low',
    lastPurchase: '2024-01-11'
  },
  {
    ageGroup: '25-34',
    gender: 'Male',
    customerCount: 1289,
    avgSpend: 3420,
    frequency: 3.5,
    preferredCategories: ['Electronics', 'Sports', 'Gaming'],
    location: 'Iloilo',
    incomeLevel: 'Middle',
    loyaltyScore: 7.2,
    churnRisk: 'Low',
    lastPurchase: '2024-01-09'
  },
  {
    ageGroup: '55+',
    gender: 'Female',
    customerCount: 987,
    avgSpend: 2890,
    frequency: 1.8,
    preferredCategories: ['Health', 'Home', 'Books'],
    location: 'Bacolod',
    incomeLevel: 'Middle',
    loyaltyScore: 8.7,
    churnRisk: 'Low',
    lastPurchase: '2024-01-13'
  }
];