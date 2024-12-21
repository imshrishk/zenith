import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '../common/Button';

interface MeditationCardProps {
  title: string;
  duration: number;
  description: string;
  imageUrl: string;
  onStart: () => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  duration,
  description,
  imageUrl,
  onStart,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="h-48 w-full object-cover"
        src={imageUrl}
        alt={title}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{duration} minutes</p>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-4">
          <Button onClick={onStart} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
};