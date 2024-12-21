import React from 'react';
import { Clock, Zap, Target } from 'lucide-react';

interface StatsSectionProps {
  totalMinutes: number;
  averageSessionLength: number;
  longestStreak: number;
}

export const StatsSection = ({
  totalMinutes,
  averageSessionLength,
  longestStreak,
}: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold">Total Time</h3>
        </div>
        <p className="text-3xl font-bold">{totalMinutes} min</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <Zap className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold">Avg. Session</h3>
        </div>
        <p className="text-3xl font-bold">{averageSessionLength} min</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <Target className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold">Longest Streak</h3>
        </div>
        <p className="text-3xl font-bold">{longestStreak} days</p>
      </div>
    </div>
  );
};