import React from 'react';
import { MapPin, Users, Activity, TrendingUp, Plane } from 'lucide-react';
import { RouteData } from '../types';

interface RouteAnalyticsProps {
  routes: RouteData[];
}

const RouteAnalytics: React.FC<RouteAnalyticsProps> = ({ routes }) => {
  const getActivityLevel = (flights: number) => {
    if (flights >= 10) return { level: 'High', color: 'text-green-600 bg-green-100', icon: '🔥' };
    if (flights >= 5) return { level: 'Medium', color: 'text-blue-600 bg-blue-100', icon: '📈' };
    return { level: 'Low', color: 'text-gray-600 bg-gray-100', icon: '📊' };
  };

  const getDemandColor = (demand: number) => {
    if (demand >= 80) return 'bg-green-500';
    if (demand >= 60) return 'bg-blue-500';
    if (demand >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin className="mr-2 text-blue-600" size={20} />
          Route Analytics
        </h3>
        <div className="text-center py-8 text-gray-500">
          No route data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MapPin className="mr-2 text-blue-600" size={20} />
          Real-Time Route Analytics
        </h3>
        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
          Live Data
        </span>
      </div>
      
      <div className="space-y-4">
        {routes.map((route, index) => {
          const activity = getActivityLevel(route.flights);
          
          return (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Plane size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{route.route}</h4>
                    <span className="text-xs text-gray-500">Route #{index + 1}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${activity.color}`}>
                  {activity.icon} {activity.level} Activity
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Activity size={16} className="text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-600">Flight Frequency</div>
                    <div className="font-medium text-gray-800">{route.flights} flights</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-green-500" />
                  <div>
                    <div className="text-xs text-gray-600">Demand Score</div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-gray-800">{route.demand}%</div>
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getDemandColor(route.demand)} transition-all duration-300`}
                          style={{ width: `${route.demand}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-orange-500" />
                  <div>
                    <div className="text-xs text-gray-600">Popularity</div>
                    <div className="font-medium text-gray-800">{route.popularity}%</div>
                  </div>
                </div>
              </div>
              
              {/* Activity indicator bar */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Activity Level</span>
                  <span>{route.flights} operations in 24h</span>
                </div>
                <div className="mt-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      route.flights >= 10 ? 'bg-green-500' : 
                      route.flights >= 5 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(100, (route.flights / 15) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Real-Time Analytics Explanation</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Flight Frequency:</strong> Number of actual flights tracked in the last 24 hours</p>
          <p><strong>Demand Score:</strong> Calculated from flight frequency and operational patterns</p>
          <p><strong>Popularity:</strong> Route utilization compared to other active routes</p>
          <p><strong>Average Price:</strong> Real-time pricing requires commercial airline APIs (Amadeus, Skyscanner Business)</p>
        </div>
      </div>
    </div>
  );
};

export default RouteAnalytics;