import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

// Save or update a user preference
router.post('/set', async (req: Request, res: Response): Promise<any> => {
  const { email, setting, value } = req.body;

  if (!email || !setting || !value) {
    return res.status(400).json({ error: 'Email, setting, and value are required.' });
  }

  //TODO: authenticate user
  //TODO: validate setting and value

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_preferences (email, setting, value)
      VALUES (?, ?, ?)
    `);

    stmt.run(email, setting, value);

    return res.status(200).json({ message: 'Preference saved successfully.' });
  } catch (error) {
    console.error('Error saving preference:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;