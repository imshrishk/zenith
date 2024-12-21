import React from 'react';

interface ActivityCalendarProps {
  activities: {
    date: string;
    count: number;
  }[];
}

export const ActivityCalendar = ({ activities }: ActivityCalendarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Meditation Activity</h3>
      <div className="grid grid-cols-7 gap-2">
        {activities.map((activity) => (
          <div
            key={activity.date}
            className={`h-8 rounded-sm ${
              activity.count === 0
                ? 'bg-gray-100'
                : activity.count < 2
                ? 'bg-indigo-200'
                : activity.count < 4
                ? 'bg-indigo-400'
                : 'bg-indigo-600'
            }`}
            title={`${activity.date}: ${activity.count} sessions`}
          />
        ))}
      </div>
    </div>
  );
};