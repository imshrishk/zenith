import { create } from 'zustand';
import { logPaymentEvent } from './LogService';
import { PaymentDetails, PaymentResponse } from '../types/payment';

interface PaymentState {
  loading: boolean;
  error: string | null;
  orderDetails: PaymentDetails | null;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,
  orderDetails: null,
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setOrderDetails: (details: PaymentDetails | null) => set({ orderDetails: details }),
  reset: () => set({ loading: false, error: null, orderDetails: null })
}));

export const initializePayment = async (options: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
  email?: string;
  phone?: string;
  name?: string;
  userId?: string;
}) => {
  const store = usePaymentStore.getState();
  store.setLoading(true);

  try {
    // Convert amount to smallest currency unit (paise for INR)
    const amountInSmallestUnit = options.amount * 100;

    // Load Razorpay script
    await loadRazorpayScript();

    // Create order
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...options,
        amount: amountInSmallestUnit
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    const order = await response.json();

    // Initialize Razorpay
    const razorpay = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: amountInSmallestUnit,
      currency: options.currency,
      name: 'ZenithMind',
      description: options.notes?.product || 'Purchase',
      prefill: {
        name: options.name || '',
        email: options.email || '',
        contact: options.phone || ''
      },
      handler: function(response: PaymentResponse) {
        handlePaymentSuccess(response, options.userId);
      },
      modal: {
        ondismiss: function() {
          store.setLoading(false);
          logPaymentEvent('PAYMENT_MODAL_CLOSED', { orderId: order.id });
        }
      }
    });

    razorpay.open();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
    store.setError(errorMessage);
    await logPaymentEvent('PAYMENT_INIT_ERROR', { error: errorMessage });
    throw error;
  } finally {
    store.setLoading(false);
  }
};

const handlePaymentSuccess = async (response: PaymentResponse, userId?: string) => {
  const store = usePaymentStore.getState();
  store.setLoading(true);

  try {
    const verification = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userId
      }),
    });

    if (!verification.ok) {
      throw new Error('Payment verification failed');
    }

    const verificationData = await verification.json();
    if (verificationData.status === 'success') {
      window.location.href = '/payment/success';
    } else {
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    store.setError('Payment verification failed');
    window.location.href = '/payment/failed';
  } finally {
    store.setLoading(false);
  }
};

const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};