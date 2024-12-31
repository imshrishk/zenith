import { create } from 'zustand';
import { logPaymentEvent } from './logService';
import { PaymentDetails, PaymentResponse } from '../types/payment';
import { logAnalyticsEvent } from '../config/firebase';

interface PaymentState {
  loading: boolean;
  error: string | null;
  orderDetails: PaymentDetails | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrderDetails: (details: PaymentDetails | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,
  orderDetails: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setOrderDetails: (details) => set({ orderDetails: details }),
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
    // Validate amount
    if (options.amount < 100 || options.amount > 1000000) {
      throw new Error('Invalid amount');
    }

    // Create order
    const response = await fetch('/api/payments/create-order', {
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
      status: 'created',
      userId: options.userId,
      email: options.email
    });

    await logPaymentEvent('ORDER_CREATED', {
      orderId: order.id,
      amount: options.amount,
      userId: options.userId
    });

    // Initialize Razorpay
    const razorpay = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: options.amount,
      currency: options.currency,
      name: 'ZenithMind',
      description: options.notes?.product || 'Purchase',
      image: '/assets/images/logo.png',
      handler: function(response: PaymentResponse) {
        handlePaymentSuccess(response, options.userId);
      },
      prefill: {
        name: options.name || '',
        email: options.email || '',
        contact: options.phone || ''
      },
      modal: {
        ondismiss: function() {
          store.setLoading(false);
          logPaymentEvent('PAYMENT_MODAL_CLOSED', { orderId: order.id });
        }
      }
    });

    razorpay.on('payment.failed', function(resp: any) {
      handlePaymentFailure(resp);
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
      throw new Error('Invalid payment response');
    }

    const verification = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userId
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!verification.ok) {
      throw new Error('Payment verification failed');
    }

    store.setOrderDetails({
      ...store.orderDetails!,
      status: 'completed'
    });

    await logPaymentEvent('PAYMENT_SUCCESS', {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      userId
    });

    logAnalyticsEvent('payment_success', {
      order_id: response.razorpay_order_id,
      payment_id: response.razorpay_payment_id,
    });

    // Redirect to success page
    window.location.href = '/payment/success';

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
    store.setError(errorMessage);
    await logPaymentEvent('PAYMENT_VERIFICATION_ERROR', { error: errorMessage });
    throw error;
  } finally {
    store.setLoading(false);
  }
};

const handlePaymentFailure = async (response: any) => {
  const store = usePaymentStore.getState();
  store.setError(response.error.description);
  
  store.setOrderDetails({
    ...store.orderDetails!,
    status: 'failed'
  });

  await logPaymentEvent('PAYMENT_FAILED', {
    orderId: response.error.metadata.order_id,
    errorCode: response.error.code,
    errorDescription: response.error.description
  });

  logAnalyticsEvent('payment_failed', {
    order_id: response.error.metadata.order_id,
    error_code: response.error.code,
    error_description: response.error.description
  });
};