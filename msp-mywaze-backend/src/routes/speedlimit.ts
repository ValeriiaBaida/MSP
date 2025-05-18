import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Haversine distance function
// Needed to get closest speed limit node
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get('/get', async (req: Request, res: Response): Promise<any> => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const latNum = parseFloat(lat as string);
  const lonNum = parseFloat(lon as string);
  const radius = 500;

  const query = `
    [out:json][timeout:25];
    (
      way(around:${radius},${lat},${lon})["maxspeed"];
    );
    (._; >;);
    out body;
  `;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const elements = response.data.elements;

    const nodes: Record<number, { lat: number; lon: number }> = {};
    const ways: {
      id: number;
      maxspeed: string;
      nodeRefs: number[];
    }[] = [];

    for (const el of elements) {
      if (el.type === 'node') {
        nodes[el.id] = { lat: el.lat, lon: el.lon };
      } else if (el.type === 'way' && el.tags?.maxspeed) {
        ways.push({ id: el.id, maxspeed: el.tags.maxspeed, nodeRefs: el.nodes });
      }
    }

    if (ways.length === 0) {
      return res.status(404).json({ message: 'No speed limit found near this location' });
    }

    let nearest = null;
    let minDist = Infinity;

    for (const way of ways) {
      for (const ref of way.nodeRefs) {
        const node = nodes[ref];
        if (!node) continue;
        const dist = haversineDistance(latNum, lonNum, node.lat, node.lon);
        if (dist < minDist) {
          minDist = dist;
          nearest = { speedLimit: way.maxspeed };
        }
      }
    }

    if (!nearest) {
      return res.status(404).json({ message: 'No nearby node found for ways with maxspeed' });
    }

    res.json({ speedLimit: nearest.speedLimit });
  } catch (error) {
    console.error('Overpass API error:', error);
    res.status(500).json({ error: 'Failed to retrieve speed limit from Overpass API' });
  }
});

export default router;