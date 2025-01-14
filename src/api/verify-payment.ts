import { Request, Response } from 'express';
import crypto from 'crypto';

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { paymentId, orderId, signature } = req.body;
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generated_signature === signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
}
