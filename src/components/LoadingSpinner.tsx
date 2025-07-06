import React from 'react';
import { Plane } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={20} />
      </div>
      <span className="ml-3 text-gray-600">Loading flight data...</span>
    </div>
  );
};

export default LoadingSpinner;