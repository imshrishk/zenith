import React from 'react';
import { BenefitsList } from './BenefitsList';
import { ResearchSection } from './ResearchSection';

export const BenefitsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Benefits of Meditation</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the scientifically proven benefits of regular meditation practice
          and how it can transform your life.
        </p>
      </div>
      <BenefitsList />
      <ResearchSection />
    </div>
  );
};