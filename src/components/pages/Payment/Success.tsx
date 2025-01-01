import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../common/Button';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate('/ebook')}
            className="w-full"
          >
            Access Your Ebook
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gray-50 text-gray-900 hover:bg-gray-100"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};