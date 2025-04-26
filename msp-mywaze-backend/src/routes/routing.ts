import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const ORS_API_KEY = '5b3ce3597851110001cf624846a2b9f568db4d3eba06d11f4ec9f208';

// Geocode destination address (wrapper of OpenRouteService API)
router.get('/geocode', async (req: Request, res: Response): Promise<any> => {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: ORS_API_KEY,
        text: destination,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching geocode data' });
  }
});

// Get route between two points (wrapper of OpenRouteService API)
router.post('/route', async (req: Request, res: Response): Promise<any> => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end coordinates are required' });
  }

  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
      {
        coordinates: [start, end],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching route data' });
  }
});

export default router;