import React from 'react';
import { Button } from '../../common/Button';
// import { initializePayment } from '../../../services/paymentService';
import { useAuthStore } from '../../../store/authStore';

export const EbookPage: React.FC = () => {
  const { user } = useAuthStore();

  const handlePurchase = () => {
    // Redirect to login if the user is not authenticated
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Open the Razorpay payment link in a new tab
    window.open('https://razorpay.me/@zenithmind', '_blank');
    
    // Old payment initialization logic
    /*
    try {
      const amountInPaise = 151 * 100; // 151 INR in paise
      const authToken = await user.getIdToken();
      localStorage.setItem('token', authToken);
      await initializePayment({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          product: 'Meditation Ebook',
          userId: user.uid,
          environment: process.env.NODE_ENV || 'development'
        },
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        userId: user.uid
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      alert('Payment initialization failed. Please try again.');
    }
    */
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Meditation Mastery Ebook</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What's Inside:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comprehensive meditation techniques</li>
            <li>Step-by-step guidance for beginners</li>
            <li>Advanced practices for experienced meditators</li>
            <li>Scientific research and benefits</li>
          </ul>
        </div>
        <div className="mb-6">
          <p className="text-2xl font-bold">₹151 only</p>
          <p className="text-gray-600">One-time purchase, lifetime access</p>
        </div>
        <Button onClick={handlePurchase} className="w-full md:w-auto">
          Purchase Now
        </Button>
      </div>
    </div>
  );
};