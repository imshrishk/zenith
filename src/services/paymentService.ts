import axios from 'axios';
import { loadScript } from '../utils/LoadScript';
import { PaymentOptions, RazorpayResponse } from '../types/payment';
import { downloadEbook } from '../utils/downloadHelper';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API_URL = import.meta.env.VITE_API_URL;

export const initializePayment = async (options: PaymentOptions): Promise<void> => {
  try {
    // Load Razorpay script
    if (!window.Razorpay) {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }

    // Ensure API URL is properly formatted
    const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    
    // Create order
    const response = await axios.post(
      `${baseURL}/create-order`,
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

    // Configure Razorpay
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
      handler: async function(response: RazorpayResponse) {
        try {
          const verifyResponse = await axios.post(
            `${baseURL}/verify-payment`,
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
          console.error('Payment verification failed:', error);
          window.location.href = '/payment/failed';
        }
      },
      modal: {
        ondismiss: function() {
          window.location.href = '/payment/failed';
        },
        escape: true,
        backdropClose: false
      },
      theme: {
        color: '#6366F1'
      }
    };

    // Initialize and open Razorpay
    const razorpay = new window.Razorpay(razorpayOptions);
    
    razorpay.on('payment.failed', function() {
      window.location.href = '/payment/failed';
    });

    razorpay.open();

  } catch (error) {
    console.error('Payment initialization error:', error);
    window.location.href = '/payment/failed';
    throw error;
  }
};