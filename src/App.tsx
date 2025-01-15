import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/pages/Home';
import { MethodsPage } from './components/pages/Methods';
import { BenefitsPage } from './components/pages/Benefits';
import { FAQPage } from './components/pages/FAQ';
import { QnAPage } from './components/pages/QnA';
import { DiscussionsPage } from './components/pages/Discussions';
import { ProfilePage } from './components/pages/Profile';
import { EbookPage } from './components/pages/Ebook';
import { PaymentSuccess } from './components/pages/Payment/Success';
import { PaymentFailed } from './components/pages/Payment/Failed';
import { Chatbot } from './components/common/chatbot';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/methods" element={<MethodsPage />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/qna" element={<QnAPage />} />
            <Route path="/discussions" element={<DiscussionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ebook" element={<EbookPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            <Route path="/donate" element={<DonateRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900">404: Page Not Found</h2>
        <p className="text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

const DonateRedirect = () => {
  React.useEffect(() => {
    window.open('https://razorpay.me/@zenithmind', '_blank');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900">Redirecting...</h2>
        <p className="text-gray-600">
          You are being redirected to our donation page. If the page does not open automatically,{' '}
          <a
            href="https://razorpay.me/@zenithmind"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            click here
          </a>.
        </p>
      </div>
    </div>
  );
};
