import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Clock } from 'lucide-react';
import { MarketInsight } from '../types';

interface InsightCardProps {
  insight: MarketInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getTrendIcon = () => {
    switch (insight.trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'down':
        return <TrendingDown className="text-red-500" size={20} />;
      default:
        return <Activity className="text-blue-500" size={20} />;
    }
  };

  const getTrendColor = () => {
    switch (insight.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getCardBorderColor = () => {
    switch (insight.trend) {
      case 'up':
        return 'border-l-green-500 hover:border-green-300';
      case 'down':
        return 'border-l-red-500 hover:border-red-300';
      default:
        return 'border-l-blue-500 hover:border-blue-300';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border-l-4 ${getCardBorderColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <Clock size={10} className="mr-1" />
              Live
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
        </div>
        <div className="ml-4 p-2 bg-gray-50 rounded-full">
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{insight.value}</div>
          <div className={`text-sm font-medium ${getTrendColor()} flex items-center`}>
            {insight.trend === 'up' && <TrendingUp size={14} className="mr-1" />}
            {insight.trend === 'down' && <TrendingDown size={14} className="mr-1" />}
            {insight.trend === 'stable' && <Minus size={14} className="mr-1" />}
            {insight.change}
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className="text-right">
          <div className={`text-xs px-2 py-1 rounded-full ${
            insight.trend === 'up' ? 'bg-green-100 text-green-700' :
            insight.trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {insight.trend === 'up' ? '↗ Increasing' :
             insight.trend === 'down' ? '↘ Decreasing' :
             '→ Stable'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;