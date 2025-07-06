import React from 'react';
import { Plane, TrendingUp, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Plane size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AeroInsight</h1>
              <p className="text-blue-100">Airline Market Demand Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span className="text-sm">Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span className="text-sm">AI Insights</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;