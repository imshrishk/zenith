import { Request, Response } from 'express';
import { razorpay } from '../config/razorpay';
import crypto from 'crypto';
import { logPaymentEvent } from '../../services/logService';
import { db } from '../../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt, notes, userId } = req.body;

    // Additional validation
    if (amount > 1000000) {
      return res.status(400).json({ error: 'Amount exceeds maximum limit' });
    }

    if (!receipt.match(/^receipt_[0-9]+$/)) {
      return res.status(400).json({ error: 'Invalid receipt format' });
    }

    const options = {
      amount,
      currency,
      receipt,
      notes: {
        ...notes,
        userId
      }
    };

    const order = await razorpay.orders.create(options);
    
    await logPaymentEvent('ORDER_CREATED', {
      orderId: order.id,
      amount,
      userId
    });

    res.json(order);
  } catch (error) {
    await logPaymentEvent('ORDER_CREATION_ERROR', { error });
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.VITE_RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      await logPaymentEvent('PAYMENT_SIGNATURE_MISMATCH', {
        orderId: razorpay_order_id,
        userId
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update user's payment status in Firebase
    if (userId) {
      await setDoc(doc(db, `users/${userId}/payments`, razorpay_payment_id), {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'completed',
        timestamp: serverTimestamp()
      });
    }

    await logPaymentEvent('PAYMENT_VERIFIED', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId
    });

    res.json({ status: 'success' });
  } catch (error) {
    await logPaymentEvent('PAYMENT_VERIFICATION_ERROR', { error });
    res.status(500).json({ error: 'Payment verification failed' });
  }
};