import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

// Interfaces for database rows
interface UserPreferenceRow {
    setting: string;
    value: string;
}

interface UserBookmarkRow {
    bookmark_name: string;
    bookmark_value: string;
}

interface UserRecentDestinationRow {
    destination_name: string;
    destination_value: string;
}

interface UserStatistics {
    avg_speed: number;
    active_days: number;
    last_active_date: string;
}


const getUserPreferences = (email: string): Record<string, string> => {
    const stmt = db.prepare('SELECT setting, value FROM user_preferences WHERE email = ?');
    const rows = stmt.all(email) as UserPreferenceRow[];

    const preferences: Record<string, string> = {};
    for (const row of rows) {
        preferences[row.setting] = row.value;
    }

    return preferences;
};

const getUserBookmarks = (email: string): Record<string, string> => {
    const stmt = db.prepare('SELECT bookmark_name, bookmark_value FROM bookmarks WHERE email = ?');
    const rows = stmt.all(email) as UserBookmarkRow[];

    const bookmarks: Record<string, string> = {};
    for (const row of rows) {
        bookmarks[row.bookmark_name] = row.bookmark_value;
    }

    return bookmarks;
}

const getUserRecentDestinations = (email: string): Record<string, string> => {
    const stmt = db.prepare('SELECT destination_name, destination_value FROM recent_destinations WHERE email = ? ORDER BY created_at DESC LIMIT 5');
    const rows = stmt.all(email) as UserRecentDestinationRow[];

    const recentDestinations: Record<string, string> = {};
    for (const row of rows) {
        recentDestinations[row.destination_name] = row.destination_value;
    }

    return recentDestinations;
}

const getUserStatistics = (email: string): UserStatistics => {
    const stmt = db.prepare(` SELECT avg_speed, active_days, last_active_date  FROM user_statistics WHERE email = ?`);
    const stats = stmt.get(email) as UserStatistics | undefined;

    if (!stats) {
        const today = new Date().toISOString().split("T")[0];

        db.prepare(`INSERT INTO user_statistics (email, avg_speed, active_days, last_active_date)VALUES (?, 47, 1, ?`).run(email, today);

        return {
            avg_speed: 47,
            active_days: 1,
            last_active_date: today,
        };
    }

    return stats;
};


// Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);

    if (user) {
      const preferences = getUserPreferences(email);
      const bookmarks = getUserBookmarks(email);
      const recentDestinations = getUserRecentDestinations(email);
      const statistics = getUserStatistics(email);

        return res.status(200).json({
            user: {
                email,
                preferences,
                bookmarks,
                recentDestinations,
                statistics,
            },
        });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Register Endpoint
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    stmt.run(email, password);

    // Default user preferences
    const stmt2 = db.prepare('INSERT INTO user_preferences (email, setting, value) VALUES (?, \'vehicle_type\', \'car\')');
    stmt2.run(email);

    // Initialize user statistics
    const today = new Date().toISOString().split("T")[0];
    db.prepare(`INSERT INTO user_statistics (email, avg_speed, active_days, last_active_date) VALUES (?, 47, 1, ?)`).run(email, today);

    const preferences = getUserPreferences(email);
    const statistics = getUserStatistics(email);
    return res.status(201).json({
        user: {
            email,
            preferences,
            statistics,
        },
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already registered' });
    }

    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;