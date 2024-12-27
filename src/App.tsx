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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}