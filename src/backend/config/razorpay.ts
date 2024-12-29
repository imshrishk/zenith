import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID!,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET!
});