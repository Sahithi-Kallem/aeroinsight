export interface FlightData {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    city: string;
    country: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    country: string;
    time: string;
  };
  aircraft: string;
  status: string;
  price?: number;
}

export interface RouteData {
  route: string;
  demand: number;
  averagePrice: number;
  flights: number;
  popularity: number;
}

export interface MarketInsight {
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
  change: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  impact: string;
}

export interface PriceAnalysis {
  route: string;
  currentPrice: number;
  historicalAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  forecast: number;
}