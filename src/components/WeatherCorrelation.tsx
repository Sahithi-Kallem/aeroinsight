import React from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCorrelationProps {
  weatherData: WeatherData[];
}

const WeatherCorrelation: React.FC<WeatherCorrelationProps> = ({ weatherData }) => {
  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain')) return <CloudRain className="text-blue-500" size={24} />;
    if (lower.includes('cloud')) return <Cloud className="text-gray-500" size={24} />;
    return <Sun className="text-yellow-500" size={24} />;
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes('High')) return 'text-green-600 bg-green-100';
    if (impact.includes('Off-peak')) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Thermometer className="mr-2 text-blue-600" size={20} />
        Weather Impact Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData.map((weather, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">{weather.location}</h4>
              {getWeatherIcon(weather.condition)}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Temperature:</span>
                <span className="text-sm font-medium">{weather.temperature}°C</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Condition:</span>
                <span className="text-sm font-medium">{weather.condition}</span>
              </div>
              
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(weather.impact)}`}>
                  {weather.impact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCorrelation;