import express from 'express';
import { createOrder, verifyPayment, downloadEbook } from '../controllers/paymentController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/create-order', authenticateUser, createOrder);
router.post('/verify-payment', authenticateUser, verifyPayment);
router.get('/download-ebook', authenticateUser, downloadEbook);

export default router;