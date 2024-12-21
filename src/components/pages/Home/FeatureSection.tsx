import React from 'react';
import { Brain, Heart, Users, Clock, Star, Shield } from 'lucide-react';

const features = [
  {
    name: 'Guided Meditations',
    description: 'Expert-led sessions for all experience levels',
    icon: Brain,
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your meditation journey and achievements',
    icon: Clock,
  },
  {
    name: 'Community Support',
    description: 'Connect with fellow meditators worldwide',
    icon: Users,
  },
  {
    name: 'Personalized Practice',
    description: 'Tailored recommendations for your goals',
    icon: Star,
  },
  {
    name: 'Mental Wellness',
    description: 'Improve focus, reduce stress, and find balance',
    icon: Heart,
  },
  {
    name: 'Private & Secure',
    description: 'Your meditation journey stays confidential',
    icon: Shield,
  },
];

export const FeatureSection = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-indigo-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need for your meditation practice</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Discover a comprehensive platform designed to support your meditation journey from beginning to mastery.
          </p>
        </div>

        <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white sm:shrink-0">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="sm:min-w-0 sm:flex-1">
                  <p className="text-lg font-semibold leading-8 text-gray-900">{feature.name}</p>
                  <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};