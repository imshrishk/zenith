import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  research: string;
}

export const BenefitCard = ({ title, description, icon: Icon, research }: BenefitCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm text-gray-500">
        <strong>Research:</strong> {research}
      </div>
    </div>
  );
};