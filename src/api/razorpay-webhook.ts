import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../config/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export async function webhook(req: Request, res: Response) {
  try {
    const shasum = crypto.createHmac('sha256', process.env.VITE_RAZORPAY_WEBHOOK_SECRET!);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      const event = req.body.event;
      const payment = req.body.payload.payment.entity;

      switch (event) {
        case 'payment.captured':
          await handlePaymentSuccess(payment);
          break;
        case 'payment.failed':
          await handlePaymentFailure(payment);
          break;
      }

      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(payment) {
  const paymentRef = doc(db, 'payments', payment.order_id);
  await setDoc(paymentRef, {
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    status: 'success',
    email: payment.email,
    userId: payment.notes.userId,
    createdAt: new Date()
  });

  const userRef = doc(db, 'users', payment.notes.userId);
  await updateDoc(userRef, {
    hasEbook: true,
    ebookPurchaseDate: new Date()
  });
}

async function handlePaymentFailure(payment) {
  const paymentRef = doc(db, 'payments', payment.order_id);
  await setDoc(paymentRef, {
    paymentId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    status: 'failed',
    email: payment.email,
    userId: payment.notes.userId,
    createdAt: new Date(),
    error: payment.error_description
  });
}
