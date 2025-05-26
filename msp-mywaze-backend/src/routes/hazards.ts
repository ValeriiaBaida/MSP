import { Router, Request, Response } from 'express';
import SSE from 'express-sse';

const router = Router();
const sse = new SSE();

// Endpoint for event stream
router.get('/events', sse.init);

// Broadcast a hazard to all connected clients
router.post('/broadcast', async (req: Request, res: Response): Promise<any> => {
  const { hazard } = req.body;
  sse.send(hazard); // broadcast to all connected clients
  res.sendStatus(200);
});

export default router;