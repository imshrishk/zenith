import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../../config/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.VITE_RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers['x-razorpay-signature'];
    
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest === signature) {
      const event = req.body;
      const paymentEntity = event.payload.payment.entity;
      
      switch (event.event) {
        case 'payment.captured':
          await handleSuccessfulPayment(paymentEntity);
          break;
          
        case 'payment.failed':
          await handleFailedPayment(paymentEntity);
          break;
      }
      
      res.status(200).json({ received: true });
    } else {
      console.error('Invalid webhook signature');
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function handleSuccessfulPayment(payment: any) {
  try {
    // 1. Record the payment in payments collection
    await addDoc(collection(db, 'payments'), {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100, // Convert from paise to rupees
      status: 'completed',
      userId: payment.notes?.userId, // Get userId from payment notes
      email: payment.email,
      timestamp: serverTimestamp(),
      productId: 'ebook'
    });

    // 2. Grant ebook access to user
    if (payment.notes?.userId) {
      await setDoc(doc(db, 'users', payment.notes.userId), {
        hasEbookAccess: true,
        ebookPurchaseDate: serverTimestamp()
      }, { merge: true });
    }

    // 3. Record transaction in user's purchase history
    await addDoc(collection(db, `users/${payment.notes?.userId}/purchases`), {
      productId: 'ebook',
      amount: payment.amount / 100,
      purchaseDate: serverTimestamp(),
      paymentId: payment.id,
      status: 'completed'
    });

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(payment: any) {
  try {
    // Record failed payment attempt
    await addDoc(collection(db, 'payments'), {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100,
      status: 'failed',
      userId: payment.notes?.userId,
      email: payment.email,
      timestamp: serverTimestamp(),
      productId: 'ebook',
      errorDescription: payment.error_description,
      errorCode: payment.error_code
    });

    // Optionally notify user about failed payment
    // You can implement email notification here

  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}