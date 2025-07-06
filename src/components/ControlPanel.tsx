import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface ControlPanelProps {
  onRouteChange: (route: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onRouteChange, onRefresh, loading }) => {
  const [selectedRoute, setSelectedRoute] = useState('SYD');
  
  const majorAirports = [
    { code: 'SYD', name: 'Sydney (SYD)', city: 'Sydney' },
    { code: 'MEL', name: 'Melbourne (MEL)', city: 'Melbourne' },
    { code: 'BNE', name: 'Brisbane (BNE)', city: 'Brisbane' },
    { code: 'PER', name: 'Perth (PER)', city: 'Perth' },
    { code: 'ADL', name: 'Adelaide (ADL)', city: 'Adelaide' },
    { code: 'DRW', name: 'Darwin (DRW)', city: 'Darwin' },
  ];

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    onRouteChange(route);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search size={20} className="text-gray-400" />
            <select
              value={selectedRoute}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {majorAirports.map(airport => (
                <option key={airport.code} value={airport.code}>
                  {airport.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600">Australian Airports</span>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;