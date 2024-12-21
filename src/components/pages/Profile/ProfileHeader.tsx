import React from 'react';
import { User, Calendar, Award } from 'lucide-react';
import { Button } from '../../common/Button';

interface ProfileHeaderProps {
  name: string;
  joinDate: string;
  totalSessions: number;
  streak: number;
  onEditProfile: () => void;
}

export const ProfileHeader = ({
  name,
  joinDate,
  totalSessions,
  streak,
  onEditProfile,
}: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onEditProfile}>
          Edit Profile
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600">{totalSessions}</div>
          <div className="text-gray-600">Total Sessions</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600">{streak}</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
      </div>
    </div>
  );
};