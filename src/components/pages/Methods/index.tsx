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
];

const practicalMeditationContent = [
  {
    title: 'Belly Breathing ',
    description: 'This is the simplest method of meditation.  When we are in meditation, we automatically start breathing from belly and its reverse is also true. Whenever we start breathing from belly we automatically become meditative.So, using this simple fact, we have developed a simplest method of meditation that we call Belly Breathing. So, start breathing from belly and meditation automatically happens. Do it now !',
  },
];

export const MethodsPage = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<number | null>(null);

  const handleComplete = () => {
    setSelectedMeditation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {selectedMeditation ? (
        <div className="max-w-3xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {meditations.find((m) => m.id === selectedMeditation)?.title}
          </h2>
          <Timer
            initialTime={meditations.find((m) => m.id === selectedMeditation)?.duration! * 60}
            onComplete={handleComplete}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-4xl font-bold text-center mb-8">Explore Meditation Methods</h2>
          <p className="text-lg text-gray-700 text-center mb-12">
            Discover effective meditation techniques tailored for modern lifestyles. Choose a practice or explore practical meditation methods for quick and lasting results.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {meditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                {...meditation}
                onStart={() => setSelectedMeditation(meditation.id)}
              />
            ))}
          </div>

          <h3 className="text-3xl font-bold text-center mb-8">Practical Meditation Methods</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {practicalMeditationContent.map((method, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4">{method.title}</h4>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700">
              Meditation not only transforms individuals but also creates a peaceful society. Practice under proper guidance for the best results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};