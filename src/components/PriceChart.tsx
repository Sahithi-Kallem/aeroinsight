import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PriceAnalysis } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  priceAnalysis: PriceAnalysis[];
}

const PriceChart: React.FC<PriceChartProps> = ({ priceAnalysis }) => {
  // Since we're using real-time data only, focus on route frequency instead of pricing
  const routeFrequencyData = {
    labels: priceAnalysis.map(p => p.route),
    datasets: [
      {
        label: 'Route Activity Level',
        data: priceAnalysis.map(p => {
          // Convert trend to activity score
          if (p.trend === 'increasing') return 3;
          if (p.trend === 'stable') return 2;
          return 1;
        }),
        backgroundColor: priceAnalysis.map(p => 
          p.trend === 'increasing' ? 'rgba(16, 185, 129, 0.8)' : 
          p.trend === 'stable' ? 'rgba(59, 130, 246, 0.8)' : 
          'rgba(107, 114, 128, 0.8)'
        ),
        borderColor: priceAnalysis.map(p => 
          p.trend === 'increasing' ? 'rgb(16, 185, 129)' : 
          p.trend === 'stable' ? 'rgb(59, 130, 246)' : 
          'rgb(107, 114, 128)'
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-Time Route Activity Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          callback: function(value: any) {
            const labels = ['Low', 'Moderate', 'High'];
            return labels[value - 1] || '';
          }
        }
      }
    }
  };

  if (priceAnalysis.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Activity Analysis</h3>
        <div className="text-center py-8 text-gray-500">
          No real-time route data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-Time Route Activity</h3>
      <div className="mb-4 text-sm text-gray-600">
        Based on current flight frequency and operational patterns
      </div>
      <Bar data={routeFrequencyData} options={options} />
    </div>
  );
};

export default PriceChart;