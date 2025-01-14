import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../common/Button';
import { downloadEbook } from '../../../utils/downloadHelper';
import { logAnalyticsEvent } from '../../../config/firebase';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    logAnalyticsEvent('payment_success_page_view');
  }, [user, navigate]);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadEbook();
      logAnalyticsEvent('manual_ebook_download_success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download ebook. Please try again or contact support.';
      setDownloadError(errorMessage);
      logAnalyticsEvent('manual_ebook_download_error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your ebook is ready for download.
          </p>
          {downloadError && (
            <p className="mt-2 text-red-600">{downloadError}</p>
          )}
        </div>
        <div className="mt-8 space-y-4">
          <Button onClick={handleDownload} disabled={downloading} className="w-full">
            {downloading ? 'Downloading...' : 'Download Ebook'}
          </Button>
          <Button onClick={() => navigate('/')} className="w-full bg-gray-50 text-gray-900 hover:bg-gray-100">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
