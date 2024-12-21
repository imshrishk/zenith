import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Brain } from 'lucide-react';
import { Button } from '../../common/Button';

export const HomeHero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Find your inner peace</span>
                <span className="block text-indigo-600">with Zenith Mind</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Begin your journey to mindfulness and mental clarity. Join our community of meditators and discover the transformative power of daily meditation practice.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/methods">
                    <Button size="lg">Start Meditating</Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/benefits">
                    <Button variant="outline" size="lg">Learn More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          //className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          //src="/api/placeholder/800/600"
          //alt="Meditation atmosphere"
        />
      </div>
    </div>
  );
};