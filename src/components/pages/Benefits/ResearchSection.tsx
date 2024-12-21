import React from 'react';
import { FileText } from 'lucide-react';

const studies = [
  {
    title: 'Effects of Mindfulness on Psychological Health',
    authors: 'Keng, S. L., Smoski, M. J., & Robins, C. J.',
    journal: 'Clinical Psychology Review',
    year: 2011,
    key_finding: 'Mindfulness promotes psychological well-being across various domains.',
  },
  {
    title: 'Meditation Programs for Psychological Stress and Well-being',
    authors: 'Goyal, M., et al.',
    journal: 'JAMA Internal Medicine',
    year: 2014,
    key_finding: 'Meditation programs can reduce anxiety, depression, and pain.',
  },
  {
    title: 'The Effect of Mindfulness Meditation on Sleep Quality',
    authors: 'Black, D. S., O\'Reilly, G. A., Olmstead, R., Breen, E. C., & Irwin, M. R.',
    journal: 'JAMA Internal Medicine',
    year: 2015,
    key_finding: 'Mindfulness meditation improves sleep quality in older adults.',
  },
];

export const ResearchSection = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-12">
      <h2 className="text-2xl font-bold mb-6">Scientific Research</h2>
      <div className="space-y-6">
        {studies.map((study) => (
          <div key={study.title} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg">{study.title}</h3>
                <p className="text-gray-600 mt-1">{study.authors}</p>
                <p className="text-sm text-gray-500">{study.journal}, {study.year}</p>
                <p className="mt-2 text-gray-700">
                  <strong>Key Finding:</strong> {study.key_finding}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};