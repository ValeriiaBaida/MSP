import express from 'express';
import routingRoutes from './routes/routing';
import authRoutes from './routes/auth';
import preferencesRoutes from './routes/preferences';
import bookmarksRoutes from './routes/bookmarks';
import speedlimitRoutes from './routes/speedlimit';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('ctrl/version', (req, res) => {
    res.send('MyWaze Backend v0.1');
});

app.use('/api/routing', routingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/speedlimit', speedlimitRoutes);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});