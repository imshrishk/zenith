import axios from 'axios';
import { loadScript } from '../utils/LoadScript';
import { PaymentOptions, RazorpayResponse } from '../types/payment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API_URL = import.meta.env.VITE_API_URL;

export const initializePayment = async (options: PaymentOptions): Promise<void> => {
  try {
    if (!window.Razorpay) {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }
    const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const response = await axios.post(
      `${baseURL}/api/create-order`,
      {
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: {
          ...options.notes,
          userId: options.userId,
          email: options.email
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (!response.data?.orderId) {
      window.location.href = '/payment/failed';
      throw new Error('Failed to create order');
    }

    const razorpayOptions = {
      key: RAZORPAY_KEY,
      amount: options.amount,
      currency: options.currency || 'INR',
      name: 'Zenith Meditation',
      description: 'Meditation Mastery Ebook',
      order_id: response.data.orderId,
      prefill: {
        name: options.name || '',
        email: options.email || '',
        contact: options.phone || ''
      },
      notes: options.notes,
      handler: async function (response: RazorpayResponse) {
        try {
          const verifyResponse = await axios.post(
            `${baseURL}/api/verify-payment`,
            {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          if (verifyResponse.data.success) {
            window.location.href = '/payment/success';
          } else {
            window.location.href = '/payment/failed';
          }
        } catch (error) {
          window.location.href = '/payment/failed';
        }
      },
      modal: {
        ondismiss: function () {
          window.location.href = '/payment/failed';
        },
        escape: true,
        backdropclose: false
      },
      theme: {
        color: '#6366F1'
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.on('payment.failed', function () {
      window.location.href = '/payment/failed';
    });
    razorpay.open();
  } catch (error) {
    window.location.href = '/payment/failed';
    throw error;
  }
};
