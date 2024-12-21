import React from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { Button } from '../../common/Button';
import { shareContent } from '../../../utils/share';
import type { User } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';

interface ThreadCardProps {
  id: string;
  title: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: any;
  likes: string[];
  comments: any[];
  tags: string[];
  currentUser: User | null;
  onLike: () => Promise<void>;
}

export const ThreadCard = ({
  title,
  authorName,
  authorPhoto,
  content,
  createdAt,
  likes,
  comments,
  tags,
  currentUser,
  onLike,
}: ThreadCardProps) => {
  const handleShare = async () => {
    await shareContent(title, content);
  };

  const isLiked = currentUser && likes.includes(currentUser.uid);
  const formattedDate = formatDistanceToNow(createdAt?.toDate() || new Date(), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <img
          src={authorPhoto || 'https://via.placeholder.com/40'}
          alt={authorName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="text-sm text-gray-500">
            <span>{authorName}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            disabled={!currentUser}
          >
            <Heart
              className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            {likes.length}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};