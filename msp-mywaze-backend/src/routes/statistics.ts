import { Router, Request, Response } from 'express';
import db from '../database/db';

const router = Router();

router.get('/get', async (req: Request, res: Response): Promise<any> => {
    const email = req.query.email as string;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const stmt = db.prepare(`SELECT avg_speed, active_days, last_active_date FROM user_statistics WHERE email = ?`);

        let stats = stmt.get(email);

        if (!stats) {
            const defaultAvg = 47;
            const today = new Date().toISOString().split('T')[0];
            db.prepare(`INSERT INTO user_statistics (email, avg_speed, active_days, last_active_date) VALUES (?, ?, 1, ?)`).run(email, defaultAvg, today);

            stats = { avg_speed: defaultAvg, active_days: 1, last_active_date: today };
        }
        res.status(200).json({ statistics: stats });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/set', async (req: Request, res: Response): Promise<any> => {
    const { email, avgSpeed } = req.body;

    if (!email || typeof avgSpeed !== 'number') {
        return res.status(400).json({ error: 'Email and avgSpeed are required' });
    }

    try {
        const selectStmt = db.prepare(`SELECT * FROM user_statistics WHERE email = ?`);
        const existingStats = selectStmt.get(email);
        const today = new Date().toISOString().split('T')[0];

        if (existingStats) {
            const updateStmt = db.prepare(`UPDATE user_statistics SET avg_speed = ?, last_active_date = ? WHERE email = ?`);
            updateStmt.run(avgSpeed, today, email);

        } else {
            db.prepare(` INSERT INTO user_statistics (email, avg_speed, active_days, last_active_date) VALUES (?, ?, 1, ?)`).run(email, avgSpeed, today);
        }
        return res.status(200).json({ message: 'Statistics updated' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/mark-active', async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const selectStmt = db.prepare("SELECT * FROM user_statistics WHERE email = ?");
        const existing = selectStmt.get(email) as { last_active_date: string | null } | undefined;
        const today = new Date().toISOString().split('T')[0];

        if (!existing) {
            db.prepare(` INSERT INTO user_statistics (email, avg_speed, active_days, last_active_date) VALUES (?, 47, 1, ?)`).run(email, today);
        } else {
            if (existing.last_active_date !== today) {
                db.prepare(` UPDATE user_statistics SET active_days = active_days + 1, last_active_date = ? WHERE email = ? `).run(today, email);
            }
        }
        res.status(200).json({ message: 'Marked active' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
