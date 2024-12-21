import React, { useState } from 'react';
import { Timer } from '../../meditation/Timer';
import { MeditationCard } from '../../meditation/MeditationCard';

const meditations = [
  {
    id: 1,
    title: 'Mindful Breathing',
    duration: 10,
    description: 'Focus on your breath to cultivate presence and awareness.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 2,
    title: 'Body Scan',
    duration: 15,
    description: 'Systematically focus attention on different parts of your body.',
    imageUrl: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 3,
    title: 'Loving-Kindness',
    duration: 20,
    description: 'Develop compassion for yourself and others.',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
];

export const MethodsPage = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<number | null>(null);

  const handleComplete = () => {
    setSelectedMeditation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {selectedMeditation ? (
        <div className="max-w-3xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {meditations.find(m => m.id === selectedMeditation)?.title}
          </h2>
          <Timer
            initialTime={meditations.find(m => m.id === selectedMeditation)?.duration! * 60}
            onComplete={handleComplete}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Practice</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                {...meditation}
                onStart={() => setSelectedMeditation(meditation.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};