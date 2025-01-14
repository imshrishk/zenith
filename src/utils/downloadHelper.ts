import axios from 'axios';
import { logAnalyticsEvent } from '../config/firebase';

export const downloadEbook = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/download-ebook`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    if (!(response.data instanceof Blob)) {
      throw new Error('Invalid download response');
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'meditation-mastery-ebook.pdf');
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    logAnalyticsEvent('ebook_download_success');
  } catch (error) {
    logAnalyticsEvent('ebook_download_error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new Error('Failed to download ebook. Please try again from the success page.');
  }
};
