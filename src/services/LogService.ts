import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const logPaymentEvent = async (eventType: string, data: any) => {
  try {
    await addDoc(collection(db, 'paymentLogs'), {
      eventType,
      data,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Payment logging failed:', error);
  }
};