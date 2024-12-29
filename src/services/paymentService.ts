import { logAnalyticsEvent } from '../config/firebase';
import { create } from 'zustand';

// Enhanced payment state management
interface PaymentState {
  loading: boolean;
  error: string | null;
  orderDetails: OrderDetails | null;
  paymentMethod: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrderDetails: (details: OrderDetails | null) => void;
  setPaymentMethod: (method: string | null) => void;
  reset: () => void;
}

interface OrderDetails {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'processing' | 'completed' | 'failed';
}

interface PaymentOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
  email?: string;
  phone?: string;
  name?: string;
}

// Enhanced payment store with more detailed state management
export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,
  orderDetails: null,
  paymentMethod: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setOrderDetails: (details) => set({ orderDetails: details }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set({ loading: false, error: null, orderDetails: null, paymentMethod: null })
}));

// Enhanced payment initialization with multiple payment options
export const initializePayment = async (options: PaymentOptions) => {
  const store = usePaymentStore.getState();
  store.setLoading(true);
  store.setError(null);

  try {
    // Create order on the server
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const order = await response.json();
    store.setOrderDetails({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      status: 'created'
    });

    // Initialize Razorpay with enhanced options
    const razorpay = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: options.amount,
      currency: options.currency,
      name: 'ZenithMind',
      description: options.notes?.product || 'Purchase',
      image: '/logo.png',
      handler: function(response: any) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: options.name || '',
        email: options.email || '',
        contact: options.phone || ''
      },
      theme: {
        color: '#4F46E5'
      },
      modal: {
        ondismiss: function() {
          store.setLoading(false);
        }
      },
      // Enable all payment methods
      config: {
        display: {
          blocks: {
            utib: {
              name: 'Pay using Bank',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' },
                { method: 'upi' }
              ]
            }
          },
          sequence: ['block.utib'],
          preferences: {
            show_default_blocks: true
          }
        }
      }
    });

    // Add event listeners for payment flow
    razorpay.on('payment.failed', function(resp: any) {
      store.setError(resp.error.description);
      store.setOrderDetails({
        ...store.orderDetails!,
        status: 'failed'
      });
      logAnalyticsEvent('payment_failed', {
        order_id: resp.error.metadata.order_id,
        error_code: resp.error.code,
        error_description: resp.error.description
      });
    });

    razorpay.open();
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Payment initialization failed');
    throw error;
  } finally {
    store.setLoading(false);
  }
};

// Enhanced payment success handler with better error handling and retries
const handlePaymentSuccess = async (response: any) => {
  const store = usePaymentStore.getState();
  store.setLoading(true);

  try {
    const verification = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      }),
    });

    if (!verification.ok) {
      throw new Error('Payment verification failed');
    }

    store.setOrderDetails({
      ...store.orderDetails!,
      status: 'completed'
    });

    logAnalyticsEvent('payment_success', {
      order_id: response.razorpay_order_id,
      payment_id: response.razorpay_payment_id,
    });

    // Redirect to download or success page
    window.location.href = '/api/download-ebook';
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Payment verification failed');
    throw error;
  } finally {
    store.setLoading(false);
  }
};

// Enhanced retry mechanism with exponential backoff
const retryPayment = async (options: PaymentOptions, retries = 3, delay = 1000): Promise<any> => {
  try {
    return await initializePayment(options);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryPayment(options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export { retryPayment };