import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FlightData, WeatherData, MarketInsight, PriceAnalysis } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const backendBaseURL = 'http://localhost:5000'; // Or your deployed backend URL

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// IATA to ICAO mapping
const IATA_TO_ICAO: { [key: string]: string } = {
  'SYD': 'YSSY', 'MEL': 'YMML', 'BNE': 'YBBN', 'PER': 'YPPH',
  'ADL': 'YPAD', 'DRW': 'YPDN', 'CNS': 'YBCS', 'HBA': 'YMHB',
  'CBR': 'YSCB', 'TSV': 'YBTL'
};

// Airport details
const AIRPORT_DETAILS: { [key: string]: { city: string; country: string; name: string } } = {
  'YSSY': { city: 'Sydney', country: 'Australia', name: 'Kingsford Smith Airport' },
  'YMML': { city: 'Melbourne', country: 'Australia', name: 'Tullamarine Airport' },
  'YBBN': { city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport' },
  'YPPH': { city: 'Perth', country: 'Australia', name: 'Perth Airport' },
  'YPAD': { city: 'Adelaide', country: 'Australia', name: 'Adelaide Airport' },
  'YPDN': { city: 'Darwin', country: 'Australia', name: 'Darwin Airport' },
  'YBCS': { city: 'Cairns', country: 'Australia', name: 'Cairns Airport' },
  'YMHB': { city: 'Hobart', country: 'Australia', name: 'Hobart Airport' },
  'YSCB': { city: 'Canberra', country: 'Australia', name: 'Canberra Airport' },
  'YBTL': { city: 'Townsville', country: 'Australia', name: 'Townsville Airport' }
};

// ✅ Use backend API to get flights

export const fetchFlightData = async (airport: string = 'SYD'): Promise<FlightData[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/flights?airport=${airport}`);
    return response.data.flights;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    throw new Error('No real-time flight data available for this airport');
  }
};


// Weather API
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        appid: WEATHER_API_KEY,
        q: city,
        units: 'metric'
      },
      timeout: 10000
    });

    if (!response.data.main || !response.data.weather) {
      throw new Error('No weather data available');
    }

    return {
      location: response.data.name || city,
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description || 'Unknown',
      impact: analyzeWeatherImpact(response.data.main.temp, response.data.weather[0].description)
    };
  } catch (error) {
    console.error(`Error fetching real-time weather data for ${city}:`, error);
    throw new Error(`Unable to fetch real-time weather data for ${city}`);
  }
};

function analyzeWeatherImpact(temperature: number, condition: string): string {
  const cond = condition?.toLowerCase() || '';
  if (cond.includes('storm') || cond.includes('heavy rain')) return 'Flight delays likely';
  if (temperature > 30) return 'Peak travel season';
  if (temperature < 10) return 'Off-peak season';
  if (cond.includes('clear') || cond.includes('sunny')) return 'Optimal travel conditions';
  return 'Normal travel conditions';
}

function extractAirlineFromCallsign(callsign: string): string {
  if (!callsign) return 'Unknown';
  const map: { [key: string]: string } = {
    'QFA': 'Qantas', 'JST': 'Jetstar', 'VOZ': 'Virgin Australia',
    'TGW': 'Tiger Airways', 'REX': 'Rex Airlines', 'UAL': 'United Airlines',
    'AAL': 'American Airlines', 'DAL': 'Delta Air Lines',
    'SIA': 'Singapore Airlines', 'CPA': 'Cathay Pacific',
    'EK': 'Emirates', 'QR': 'Qatar Airways'
  };
  const prefix = callsign.substring(0, 3).toUpperCase();
  return map[prefix] || prefix;
}

function determineFlightStatus(flightStatus: string): string {
  const status = flightStatus?.toLowerCase();

  if (!status) return 'Unknown';

  switch (status) {
    case 'scheduled':
      return 'Scheduled';
    case 'active':
    case 'en-route':
      return 'In Flight';
    case 'landed':
      return 'Arrived';
    case 'cancelled':
      return 'Cancelled';
    case 'incident':
    case 'diverted':
      return 'Disrupted';
    default:
      return 'Unknown';
  }
}

// AI-generated insights using Gemini
export const generateMarketInsights = async (flightData: FlightData[]): Promise<MarketInsight[]> => {
  try {
    if (flightData.length === 0) throw new Error('No flight data available for analysis');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const routes = [...new Set(flightData.map(f => `${f.departure.airport}-${f.arrival.airport}`))];
    const airlines = [...new Set(flightData.map(f => f.airline))];
    const statuses = flightData.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const dataContext = `
    Analyze this REAL-TIME airline flight data from the last 24 hours and provide exactly 4 specific aviation market insights:

    FLIGHT DATA:
    - Total flights tracked: ${flightData.length}
    - Active airlines: ${airlines.join(', ')}
    - Top routes: ${routes.slice(0, 10).join(', ')}
    - Flight statuses: ${Object.entries(statuses).map(([s, c]) => `${s}: ${c}`).join(', ')}
    - Timestamp: ${new Date().toISOString()}

    FORMAT: Title|Description|Trend|Value|Change
    `;

    const result = await model.generateContent(dataContext);
    const response = await result.response;
    const text = response.text();

    const insights = text.split('\n').filter(line => line.includes('|')).slice(0, 4);
    if (insights.length === 0) {
      return generateFallbackInsights(flightData, routes, airlines, statuses);
    }

    return insights.map(line => {
      const parts = line.split('|');
      return {
        title: parts[0]?.trim(),
        description: parts[1]?.trim(),
        trend: (parts[2]?.toLowerCase().trim() as 'up' | 'down' | 'stable'),
        value: parts[3]?.trim(),
        change: parts[4]?.trim()
      };
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    const routes = [...new Set(flightData.map(f => `${f.departure.airport}-${f.arrival.airport}`))];
    const airlines = [...new Set(flightData.map(f => f.airline))];
    const statuses = flightData.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return generateFallbackInsights(flightData, routes, airlines, statuses);
  }
};

function generateFallbackInsights(
  flightData: FlightData[], 
  routes: string[], 
  airlines: string[], 
  statuses: { [key: string]: number }
): MarketInsight[] {
  const airlineFrequency: { [key: string]: number } = {};
  flightData.forEach(f => {
    if (f.airline) {
      airlineFrequency[f.airline] = (airlineFrequency[f.airline] || 0) + 1;
    }
  });

  const topAirline = Object.entries(airlineFrequency).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];

  return [
    {
      title: 'Traffic Volume',
      description: 'Total operations in last 24 hours',
      trend: flightData.length > 20 ? 'up' : 'down',
      value: `${flightData.length} flights`,
      change: 'Compared to average'
    },
    {
      title: 'Route Coverage',
      description: 'Unique routes in operation',
      trend: routes.length > 10 ? 'up' : 'stable',
      value: `${routes.length} routes`,
      change: 'Dynamic network'
    },
    {
      title: 'Airline Diversity',
      description: 'Active carriers currently operating',
      trend: airlines.length > 5 ? 'up' : 'down',
      value: `${airlines.length} airlines`,
      change: 'Varied operator mix'
    },
    {
      title: 'Top Airline Activity',
      description: 'Most active carrier based on real-time data',
      trend: topAirline[1] > 5 ? 'up' : topAirline[1] > 2 ? 'stable' : 'down',
      value: `${topAirline[0]} (${topAirline[1]} flights)`,
      change: 'Leading carrier across multiple routes'
    }
  ];
}


// Placeholder price analysis
export const analyzePriceData = async (flightData: FlightData[]): Promise<PriceAnalysis[]> => {
  const routes = [...new Set(flightData.map(f => `${f.departure.airport}-${f.arrival.airport}`))];
  return routes.slice(0, 5).map(route => {
    const count = flightData.filter(f => `${f.departure.airport}-${f.arrival.airport}` === route).length;
    return {
      route,
      currentPrice: 0,
      historicalAverage: 0,
      trend: count > 5 ? 'increasing' : count > 2 ? 'stable' : 'decreasing',
      forecast: 0
    };
  });
};
