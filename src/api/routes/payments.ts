import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { validatePaymentRequest } from '../middleware/paymentValidation';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/create-order', 
  authenticateUser, 
  validatePaymentRequest, 
  createOrder
);

router.post('/verify', 
  authenticateUser, 
  verifyPayment
);

export default router;