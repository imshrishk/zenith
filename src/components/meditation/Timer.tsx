import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

interface TimerProps {
  initialTime: number;
  onComplete?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialTime, onComplete }) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-6xl font-bold text-indigo-600">
        {formatTime(time)}
      </div>
      <div className="flex space-x-4">
        <Button
          onClick={isActive ? togglePause : toggleTimer}
          variant="primary"
          size="lg"
        >
          {isActive ? (
            isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};