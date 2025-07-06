import React from 'react';
import { Plane, Clock, MapPin, AlertCircle } from 'lucide-react';
import { FlightData } from '../types';

interface FlightTableProps {
  flights: FlightData[];
}

const FlightTable: React.FC<FlightTableProps> = ({ flights }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'departed':
        return 'bg-green-100 text-green-800';
      case 'arrived':
        return 'bg-gray-100 text-gray-800';
      case 'in flight':
        return 'bg-purple-100 text-purple-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return 'N/A';
    }
  };

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Plane className="mr-2 text-blue-600" size={20} />
            Real-Time Flight Data
          </h3>
        </div>
        <div className="p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Real-Time Data Available</h4>
          <p className="text-gray-500">
            Unable to fetch real-time flight data for this airport. 
            Please try selecting a different airport or check your connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Plane className="mr-2 text-blue-600" size={20} />
          Real-Time Flight Data
          <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Live
          </span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {flights.length} flights from the last 24 hours
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aircraft
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map((flight, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{flight.flightNumber}</div>
                    <div className="text-sm text-gray-500">{flight.airline}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">
                      {flight.departure.airport} → {flight.arrival.airport}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {flight.departure.city} → {flight.arrival.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">
                      {formatTime(flight.departure.time)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(flight.status)}`}>
                    {flight.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.aircraft || 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;