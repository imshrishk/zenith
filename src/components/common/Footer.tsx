import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-600">
            © {currentYear} ZenithMind. All Rights Reserved.
          </div>
          <div className="text-gray-600">
            Developed by{' '}
            <a 
              href="https://github.com/imshrishk/"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shrish Kumar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};