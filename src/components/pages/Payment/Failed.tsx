import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../../common/Button';

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Payment Failed</h2>
          <p className="mt-2 text-gray-600">We couldn't process your payment. Please try again.</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate('/ebook')}
            className="w-full"
          >
            Try Again
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