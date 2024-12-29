import React from 'react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed bottom-4 right-4 p-4 rounded-md shadow-lg",
      type === 'success' && "bg-green-500",
      type === 'error' && "bg-red-500",
      type === 'info' && "bg-blue-500",
      "text-white"
    )}>
      {message}
    </div>
  );
};