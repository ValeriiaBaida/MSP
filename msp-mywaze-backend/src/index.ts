import express from 'express';
import routingRoutes from './routes/routing';
import authRoutes from './routes/auth';
import preferencesRoutes from './routes/preferences';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MyWaze Backend v0.1');
});

app.use('/api/routing', routingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});