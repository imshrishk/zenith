import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupCSRF } from './middleware/csrf';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
      connectSrc: ["'self'", "https://api.razorpay.com"]
    }
  }
}));

app.use(cors({
  origin: process.env.VITE_CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Rate limiting
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: 'Too many payment attempts, please try again later'
});

app.use('/api/payments/*', paymentLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' })); // Limit payload size

// CSRF protection
setupCSRF(app);

// Routes
import paymentRoutes from './routes/payment';
app.use('/api', paymentRoutes);

export default app;