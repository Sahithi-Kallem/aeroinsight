// server.js (backend using AviationStack)
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Helper: Map AviationStack status to readable format
function determineFlightStatus(status) {
  if (!status) return 'Unknown';

  switch (status.toLowerCase()) {
    case 'scheduled': return 'Scheduled';
    case 'active':
    case 'en-route': return 'In Flight';
    case 'landed': return 'Arrived';
    case 'cancelled': return 'Cancelled';
    case 'incident':
    case 'diverted': return 'Disrupted';
    default: return 'Unknown';
  }
}

// Route: Fetch real-time flight data
app.get('/api/flights', async (req, res) => {
  const airport = (req.query.airport || 'SYD').toUpperCase();

  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        arr_iata: airport,
        limit: 30
      }
    });

    const flights = response.data.data.map(f => ({
      flightNumber: f.flight?.iata || 'N/A',
      airline: f.airline?.name || 'Unknown',
      departure: {
        airport: f.departure?.iata || 'N/A',
        city: f.departure?.airport || 'Unknown',
        country: 'Unknown',
        time: f.departure?.estimated || f.departure?.scheduled || 'N/A'
      },
      arrival: {
        airport: f.arrival?.iata || 'N/A',
        city: f.arrival?.airport || 'Unknown',
        country: 'Unknown',
        time: f.arrival?.estimated || f.arrival?.scheduled || 'N/A'
      },
      aircraft: f.aircraft?.model || 'N/A',
      status: determineFlightStatus(f.flight_status),
      price: undefined // pricing requires commercial API
    }));

    res.json({ flights });
  } catch (err) {
    console.error('AviationStack error:', err.message);
    res.status(500).json({ message: 'Failed to fetch flight data', flights: [] });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server @ http://localhost:${PORT}`));
