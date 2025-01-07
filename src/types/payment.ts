export interface PaymentOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes: {
      [key: string]: string;
    };
    name: string;
    email: string;
    phone: string;
    userId: string;
  }
  
  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  export interface PaymentRecord {
    paymentId: string;
    orderId: string;
    amount: number;
    status: 'success' | 'failed';
    email: string;
    userId: string;
    createdAt: Date;
    error?: string;
  }