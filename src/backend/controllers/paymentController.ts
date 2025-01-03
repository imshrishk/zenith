import { Request, Response } from 'express';
import { razorpay } from '../config/razorpay';
import crypto from 'crypto';
import { logPaymentEvent } from '../../services/LogService';
import { db } from '../../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt, notes, userId } = req.body;
    
    const options = {
      amount: amount,
      currency: currency.toUpperCase(),
      receipt: receipt,
      notes: {
        ...notes,
        userId,
        environment: process.env.NODE_ENV
      }
    };

    const order = await razorpay.orders.create(options);
    
    await logPaymentEvent('ORDER_CREATED', {
      orderId: order.id,
      amount,
      userId,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      ...order,
      key: process.env.VITE_RAZORPAY_KEY_ID
    });
  } catch (error) {
    await logPaymentEvent('ORDER_CREATION_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
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
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.VITE_RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      await logPaymentEvent('PAYMENT_SIGNATURE_MISMATCH', {
        orderId: razorpay_order_id,
        userId,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Record successful payment
    if (userId) {
      const paymentRef = doc(db, `users/${userId}/payments`, razorpay_payment_id);
      await setDoc(paymentRef, {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'completed',
        timestamp: serverTimestamp(),
        verificationMethod: 'signature',
        environment: process.env.NODE_ENV
      });

      // Update user's access
      await setDoc(doc(db, 'users', userId), {
        hasEbookAccess: true,
        ebookPurchaseDate: serverTimestamp()
      }, { merge: true });
    }

    await logPaymentEvent('PAYMENT_VERIFIED', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      status: 'success',
      message: 'Payment verified successfully'
    });
  } catch (error) {
    await logPaymentEvent('PAYMENT_VERIFICATION_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Payment verification failed' });
  }
};