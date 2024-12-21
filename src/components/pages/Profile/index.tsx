import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ActivityCalendar } from './ActivityCalendar';
import { StatsSection } from './StatsSection';

// Sample data - In a real app, this would come from your backend
const sampleActivities = Array.from({ length: 28 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 5),
}));

export const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProfileHeader
        name="Alex Johnson"
        joinDate="January 2024"
        totalSessions={42}
        streak={7}
        onEditProfile={() => {/* TODO: Implement edit profile */}}
      />
      
      <div className="mt-8">
        <StatsSection
          totalMinutes={630}
          averageSessionLength={15}
          longestStreak={12}
        />
      </div>

      <div className="mt-8">
        <ActivityCalendar activities={sampleActivities} />
      </div>
    </div>
  );
};