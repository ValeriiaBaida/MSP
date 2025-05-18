import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

// Save or update a user preference
router.post('/set', async (req: Request, res: Response): Promise<any> => {
  const { email, bookmark_name, bookmark_value } = req.body;

  if (!email || !bookmark_name || !bookmark_value) {
    return res.status(400).json({ error: 'Email, bookmark name, and bookmark value are required.' });
  }

  //TODO: authenticate user

  const bookmark_value_str = JSON.stringify(bookmark_value);

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO bookmarks (email, bookmark_name, bookmark_value)
      VALUES (?, ?, ?)
    `);

    stmt.run(email, bookmark_name, bookmark_value_str);

    return res.status(200).json({ message: 'Bookmark saved successfully.' });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;