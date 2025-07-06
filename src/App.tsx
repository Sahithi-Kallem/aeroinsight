import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import InsightCard from './components/InsightCard';
import FlightTable from './components/FlightTable';
import PriceChart from './components/PriceChart';
import WeatherCorrelation from './components/WeatherCorrelation';
import RouteAnalytics from './components/RouteAnalytics';
import ControlPanel from './components/ControlPanel';
import { 
  fetchFlightData, 
  fetchWeatherData, 
  generateMarketInsights, 
  analyzePriceData 
} from './services/api';
import { FlightData, MarketInsight, WeatherData, PriceAnalysis, RouteData } from './types';

function App() {
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis[]>([]);
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState('SYD');

  const majorCities = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'];

  const loadData = async (route: string = selectedRoute) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch real-time flight data
      console.log('Fetching real-time flight data...');
      const flights = await fetchFlightData(route);
      setFlightData(flights);

      if (flights.length === 0) {
        setError('No real-time flight data available for this airport');
        return;
      }

      // Generate AI insights from real data
      console.log('Generating real-time insights...');
      try {
        const marketInsights = await generateMarketInsights(flights);
        setInsights(marketInsights);
      } catch (insightError) {
        console.warn('Could not generate insights:', insightError);
        setInsights([]);
      }

      // Analyze real flight patterns
      console.log('Analyzing flight patterns...');
      try {
        const priceData = await analyzePriceData(flights);
        setPriceAnalysis(priceData);
      } catch (priceError) {
        console.warn('Could not analyze price data:', priceError);
        setPriceAnalysis([]);
      }

      // Fetch real-time weather data
      console.log('Fetching real-time weather data...');
      const weatherPromises = majorCities.map(async (city) => {
        try {
          return await fetchWeatherData(city);
        } catch (weatherError) {
          console.warn(`Could not fetch weather for ${city}:`, weatherError);
          return null;
        }
      });
      
      const weatherResults = await Promise.all(weatherPromises);
      const validWeatherData = weatherResults.filter(w => w !== null) as WeatherData[];
      setWeatherData(validWeatherData);

      // Generate real-time route analytics
      console.log('Generating route analytics...');
      const routes = [...new Set(flights.map(f => `${f.departure.airport}-${f.arrival.airport}`))];
      const routeAnalytics = routes.slice(0, 5).map((route) => {
        const routeFlights = flights.filter(f => `${f.departure.airport}-${f.arrival.airport}` === route);
        const frequency = routeFlights.length;
        
        return {
          route,
          demand: Math.min(100, frequency * 10), // Convert frequency to demand percentage
          averagePrice: 0, // Real pricing requires commercial APIs
          flights: routeFlights.length,
          popularity: Math.min(100, frequency * 8) // Convert to popularity score
        };
      });
      setRouteData(routeAnalytics);

    } catch (error) {
      console.error('Error loading real-time data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load real-time data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    loadData(route);
  };

  const handleRefresh = () => {
    loadData(selectedRoute);
  };

  if (loading && flightData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
          <div className="text-center mt-4">
            <p className="text-gray-600">Fetching real-time aviation data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && flightData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Real-Time Data Unavailable</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ControlPanel 
          onRouteChange={handleRouteChange} 
          onRefresh={handleRefresh}
          loading={loading}
        />
        
        {/* Real-time status indicator */}
        <div className="mb-6 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">Real-Time Data Active</span>
          </div>
          <span className="text-green-600 text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        {/* Market Insights Grid */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        )}

        {/* Route Activity Analysis */}
        {priceAnalysis.length > 0 && (
          <div className="mb-8">
            <PriceChart priceAnalysis={priceAnalysis} />
          </div>
        )}

        {/* Route Analytics */}
        {routeData.length > 0 && (
          <div className="mb-8">
            <RouteAnalytics routes={routeData} />
          </div>
        )}

        {/* Weather Correlation */}
        {weatherData.length > 0 && (
          <div className="mb-8">
            <WeatherCorrelation weatherData={weatherData} />
          </div>
        )}

        {/* Real-time Flight Data Table */}
        <FlightTable flights={flightData} />
      </div>
    </div>
  );
}

export default App;