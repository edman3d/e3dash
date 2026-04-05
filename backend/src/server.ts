import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import medicationRoutes from './routes/medication';
import bloodSugarRoutes from './routes/bloodSugar';
import medicationTypesRoutes from './routes/medicationTypes';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Trust proxy only in production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 5000,
  message: 'Too many requests from this IP, please try again later.',
  // Handle Vercel's proxy headers properly
  keyGenerator: (req: any) => {
    // Get IP from X-Forwarded-For header if available, otherwise use connection IP
    return req.headers['x-forwarded-for'] as string || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           'unknown';
  }
} as any);

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app'] 
    : ['http://localhost:5173'],
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/medication', medicationRoutes);
app.use('/api/blood-sugar', bloodSugarRoutes);
app.use('/api/medication-types', medicationTypesRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
