import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { ThreadCard } from './ThreadCard';
import { CreateThreadForm } from './CreateThreadForm';
import { useAuth } from '../../../hooks/useAuth';
import {
  getThreads,
  createThread,
  likeThread,
  unlikeThread,
  addComment,
  deleteThread,
  deleteComment
} from '../../../services/discussionService';
import type { Thread } from '../../../types/firebase';
import { trackUserEngagement } from '../../../services/analyticsService';

export const DiscussionsPage = () => {
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchThreads = async () => {
    try {
      const fetchedThreads = await getThreads();
      setThreads(fetchedThreads);
      setError(null);
    } catch (error) {
      setError('Failed to load discussions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleCreateThread = async (data: {
    title: string;
    content: string;
    tags: string[];
    media: string[];
  }) => {
    if (!user) return;
    try {
      await createThread(
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL || '',
        data.title,
        data.content,
        data.tags,
        data.media
      );
      trackUserEngagement('create', 'thread');
      setIsCreatingThread(false);
      await fetchThreads();
    } catch (error) {
      setError('Failed to create thread. Please try again.');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!user) return;
    try {
      await deleteThread(threadId);
      trackUserEngagement('delete', 'thread');
      await fetchThreads();
    } catch (error) {
      setError('Failed to delete thread. Please try again.');
    }
  };

  const handleDeleteComment = async (threadId: string, commentId: string) => {
    if (!user) return;
    try {
      await deleteComment(threadId, commentId);
      trackUserEngagement('delete', 'comment');
      await fetchThreads(); // Refresh the threads list
    } catch (error) {
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleLikeThread = async (threadId: string, isLiked: boolean) => {
    if (!user) return;
    try {
      if (isLiked) {
        await unlikeThread(threadId, user.uid);
      } else {
        await likeThread(threadId, user.uid);
      }
      trackUserEngagement('like', 'thread');
      await fetchThreads();
    } catch (error) {
      setError('Failed to update like. Please try again.');
    }
  };

  const handleComment = async (threadId: string, content: string, media: string[] = []) => {
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError(null);
    try {
      await addComment(
        threadId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL || '',
        content,
        media
      );
      trackUserEngagement('comment', 'thread');
      await fetchThreads();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Forum</h1>
        {user && (
          <Button onClick={() => setIsCreatingThread(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

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
              onLike={() => handleLikeThread(thread.id, thread.likes.includes(user?.uid || ''))}
              onComment={(content, media) => handleComment(thread.id, content, media)}
              onDelete={() => handleDeleteThread(thread.id)}
              onDeleteComment={(commentId) => handleDeleteComment(thread.id, commentId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};