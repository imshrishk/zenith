export interface PaymentDetails {
    orderId: string;
    amount: number;
    currency: string;
    receipt: string;
    status: 'created' | 'processing' | 'completed' | 'failed';
    userId?: string;
    email?: string;
    metadata?: Record<string, any>;
  }
  
  export interface PaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }