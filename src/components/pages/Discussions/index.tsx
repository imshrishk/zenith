import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { ThreadCard } from './ThreadCard';
import { CreateThreadForm } from './CreateThreadForm';
import { useAuth } from '../../../hooks/useAuth';
import { getThreads } from '../../../services/discussionService';
import type { Thread } from '../../../types/firebase';
import { trackUserEngagement } from '../../../services/analyticsService';

export const DiscussionsPage = () => {
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const fetchedThreads = await getThreads();
        setThreads(fetchedThreads);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleCreateThread = async (data: { title: string; content: string; tags: string[] }) => {
    if (!user) return;

    try {
      await createThread(
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL || '',
        data.title,
        data.content,
        data.tags
      );
      
      trackUserEngagement('create', 'thread');
      setIsCreatingThread(false);
      
      // Refresh threads
      const updatedThreads = await getThreads();
      setThreads(updatedThreads);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discussions</h1>
        {user && (
          <Button onClick={() => setIsCreatingThread(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        )}
      </div>

      {isCreatingThread ? (
        <CreateThreadForm
          onSubmit={handleCreateThread}
          onCancel={() => setIsCreatingThread(false)}
        />
      ) : (
        <div className="space-y-6">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              {...thread}
              currentUser={user}
              onLike={async () => {
                if (!user) return;
                try {
                  if (thread.likes.includes(user.uid)) {
                    await unlikeThread(thread.id, user.uid);
                  } else {
                    await likeThread(thread.id, user.uid);
                  }
                  trackUserEngagement('like', 'thread');
                  // Refresh threads
                  const updatedThreads = await getThreads();
                  setThreads(updatedThreads);
                } catch (error) {
                  console.error('Error updating like:', error);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};