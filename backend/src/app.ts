import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import puzzleRoutes from './routes/puzzle.routes';
import attemptRoutes from './routes/attempt.routes';
import lichessRoutes from './routes/lichess.routes';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/puzzles', puzzleRoutes);
app.use('/attempts', attemptRoutes);
app.use('/lichess', lichessRoutes);

app.use(errorMiddleware);
