import { Request, Response } from 'express';
import { razorpay } from '../config/razorpay';
import crypto from 'crypto';
import path from 'path';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.VITE_RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified - store in database if needed
      return res.status(200).json({
        message: "Payment verified successfully"
      });
    } else {
      return res.status(400).json({
        message: "Invalid signature sent!"
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

export const downloadEbook = async (req: Request, res: Response) => {
  try {
    // Verify user has purchased the ebook
    // This should check against your database
    
    const filePath = path.join(__dirname, '../../../assets/ebooks/meditation-mastery.pdf');
    res.download(filePath, 'meditation-mastery.pdf', (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
};