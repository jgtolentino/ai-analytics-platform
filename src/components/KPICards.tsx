import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

interface KPICardsProps {
  data: KPICardProps[];
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  icon, 
  label, 
  value, 
  change, 
  changeType = 'neutral' 
}) => {
  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  }[changeType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
    >
      {/* Icon - Inline only, no background */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className={`text-xs font-medium ${changeColor}`}>
            {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
          </span>
        )}
      </div>
      
      {/* Value */}
      <div className="mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      
      {/* Label */}
      <div className="text-sm font-medium text-gray-600">{label}</div>
    </motion.div>
  );
};

export const KPICards: React.FC<KPICardsProps> = ({ data, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {data.map((kpi, index) => (
        <KPICard
          key={`${kpi.label}-${index}`}
          {...kpi}
        />
      ))}
    </div>
  );
};

// Predefined KPI sets for different dashboards
export const ScoutKPIs: KPICardProps[] = [
  {
    icon: '💰',
    label: 'Revenue',
    value: '₱2.4M',
    change: '+12%',
    changeType: 'positive'
  },
  {
    icon: '🛒',
    label: 'Transactions',
    value: '8,429',
    change: '+5.2%',
    changeType: 'positive'
  },
  {
    icon: '👥',
    label: 'Customers',
    value: '3,247',
    change: '+8.1%',
    changeType: 'positive'
  },
  {
    icon: '📦',
    label: 'Products',
    value: '156',
    change: '-2%',
    changeType: 'negative'
  }
];

export const VibeTestBotKPIs: KPICardProps[] = [
  {
    icon: '🐛',
    label: 'Bugs Fixed',
    value: '47',
    change: '+23%',
    changeType: 'positive'
  },
  {
    icon: '⚡',
    label: 'Fix Speed',
    value: '1.2s',
    change: '-15%',
    changeType: 'positive'
  },
  {
    icon: '🛡️',
    label: 'Coverage',
    value: '94%',
    change: '+3%',
    changeType: 'positive'
  },
  {
    icon: '✨',
    label: 'Vibe Score',
    value: '85',
    change: '+7pts',
    changeType: 'positive'
  }
];

export const CESKPIs: KPICardProps[] = [
  {
    icon: '🎯',
    label: 'Campaigns',
    value: '24',
    change: '+4',
    changeType: 'positive'
  },
  {
    icon: '📈',
    label: 'Effectiveness',
    value: '87%',
    change: '+12%',
    changeType: 'positive'
  },
  {
    icon: '💡',
    label: 'Insights',
    value: '156',
    change: '+28',
    changeType: 'positive'
  },
  {
    icon: '🔥',
    label: 'ROI',
    value: '3.4x',
    change: '+0.8x',
    changeType: 'positive'
  }
];

export default KPICards;