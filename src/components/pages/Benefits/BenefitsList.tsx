import React from 'react';
import { Brain, Heart, Battery, Moon, Zap, Smile } from 'lucide-react';
import { BenefitCard } from './BenefitCard';

const benefits = [
  {
    title: 'Improved Focus',
    description: 'Enhance concentration and mental clarity through regular practice.',
    icon: Brain,
    research: 'Studies show meditation can increase attention span by up to 50%.',
  },
  {
    title: 'Stress Reduction',
    description: 'Lower cortisol levels and better stress management.',
    icon: Heart,
    research: 'Regular meditation reduces stress hormone levels by 15-20%.',
  },
  {
    title: 'Better Sleep',
    description: 'Fall asleep faster and enjoy higher quality rest.',
    icon: Moon,
    research: 'Meditation improves sleep quality by addressing racing thoughts.',
  },
  {
    title: 'Emotional Balance',
    description: 'Develop better emotional regulation and resilience.',
    icon: Smile,
    research: 'Practitioners report 60% better emotional regulation.',
  },
  {
    title: 'Increased Energy',
    description: 'Feel more energized and focused throughout the day.',
    icon: Battery,
    research: 'Regular meditation increases daily energy levels by 30%.',
  },
  {
    title: 'Enhanced Creativity',
    description: 'Boost creative thinking and problem-solving abilities.',
    icon: Zap,
    research: 'Meditation increases creative problem-solving by 40%.',
  },
];

export const BenefitsList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit) => (
        <BenefitCard key={benefit.title} {...benefit} />
      ))}
    </div>
  );
};