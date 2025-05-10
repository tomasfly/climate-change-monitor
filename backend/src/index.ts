import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { authRouter } from './routes/auth';
import { zoneRouter } from './routes/zones';
import { actionRouter } from './routes/actions';
import { sensorRouter } from './routes/sensors';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/zones', zoneRouter);
app.use('/api/actions', actionRouter);
app.use('/api/sensors', sensorRouter);

// Error handling
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await createConnection();
    logger.info('Database connection established');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 