import React from 'react';
import { Button } from '../../common/Button';
import { initializePayment } from '../../../services/paymentService';

export const EbookPage: React.FC = () => {
  const handlePurchase = async () => {
    try {
      await initializePayment({
        amount: 15100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          product: 'Meditation Ebook'
        },
        name: user?.displayName,
        email: user?.email,
        phone: user?.phoneNumber
      });
    } catch (error) {
      // Handle error
    }
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
        <Button 
          onClick={handlePurchase}
          className="w-full md:w-auto"
        >
          Purchase Now
        </Button>
      </div>
    </div>
  );
};