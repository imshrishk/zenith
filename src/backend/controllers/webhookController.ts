import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../../config/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Verify webhook signature
    const webhookSecret = process.env.VITE_RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Process webhook event
    const event = req.body;
    const paymentEntity = event.payload.payment?.entity;
    
    if (!paymentEntity) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentSuccess(paymentEntity);
        break;
      case 'payment.failed':
        await handlePaymentFailure(paymentEntity);
        break;
      case 'payment.authorized':
        await handlePaymentAuthorized(paymentEntity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function handlePaymentSuccess(payment: any) {
  try {
    const paymentDoc = {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100, // Convert to actual currency
      status: 'completed',
      userId: payment.notes?.userId,
      email: payment.email,
      timestamp: serverTimestamp(),
      method: payment.method,
      currency: payment.currency
    };

    // Store payment record
    await addDoc(collection(db, 'payments'), paymentDoc);

    // Update user access if userId exists
    if (payment.notes?.userId) {
      await setDoc(
        doc(db, 'users', payment.notes.userId),
        {
          hasEbookAccess: true,
          ebookPurchaseDate: serverTimestamp(),
          lastPayment: paymentDoc
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailure(payment: any) {
  try {
    await addDoc(collection(db, 'payments'), {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100,
      status: 'failed',
      userId: payment.notes?.userId,
      email: payment.email,
      timestamp: serverTimestamp(),
      errorCode: payment.error_code,
      errorDescription: payment.error_description
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

async function handlePaymentAuthorized(payment: any) {
  try {
    await addDoc(collection(db, 'payments'), {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100,
      status: 'authorized',
      userId: payment.notes?.userId,
      email: payment.email,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error handling payment authorization:', error);
    throw error;
  }
}