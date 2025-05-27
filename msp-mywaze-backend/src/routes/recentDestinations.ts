import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

// Save or update a user preference
router.post('/set', async (req: Request, res: Response): Promise<any> => {
  const { email, destination_name, destination_value } = req.body;

  if (!email || !destination_name || !destination_value) {
    return res.status(400).json({ error: 'Email, destination name, and destination value are required.' });
  }

  //TODO: authenticate user

  const destination_value_str = JSON.stringify(destination_value);

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO recent_destinations (email, destination_name, destination_value, created_at)
      VALUES (?, ?, ?, ?)
    `);

    const created_at = Date.now();

    stmt.run(email, destination_name, destination_value_str, created_at);

    return res.status(200).json({ message: 'Recent destination saved successfully.' });
  } catch (error) {
    console.error('Error saving recent destination:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;