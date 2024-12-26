import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import { RichTextEditor } from '../../common/RichTextEditor';
import { MediaUploader } from '../../common/MediaUploader';
import { formatDistanceToNow } from 'date-fns';
import { shareContent } from '../../../utils/share';
import type { User } from 'firebase/auth';
import type { Thread, Comment } from '../../../types/firebase';
import type { UploadedFile } from '../../common/MediaUploader/types';

interface ThreadCardProps extends Thread {
  currentUser: User | null;
  onLike: () => Promise<void>;
  onComment: (content: string, media: string[]) => Promise<void>;
  onDelete: () => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  title,
  authorId,
  authorName,
  authorPhoto,
  content,
  createdAt,
  likes,
  comments,
  tags,
  media,
  currentUser,
  onLike,
  onComment,
  onDelete,
  onDeleteComment,
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentMedia, setCommentMedia] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onComment(
        commentContent,
        commentMedia.map((file) => file.url)
      );
      setCommentContent('');
      setCommentMedia([]);
      setIsCommenting(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareContent(
        title,
        `${authorName} shared a thought about ${tags.join(', ')}`
      );
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const canDelete = currentUser && authorId === currentUser.uid;
  const isLiked = currentUser && likes.includes(currentUser.uid);
  const formattedDate = formatDistanceToNow(createdAt?.toDate() || new Date(), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
        <img
          src={authorPhoto || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
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
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        className="prose max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {media && media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {media.map((url, index) => (
            <div key={index} className="relative">
              {url.includes('video') ? (
                <video src={url} controls className="w-full rounded" />
              ) : (
                <img src={url} alt="" className="w-full rounded object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

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

      <div className="flex items-center justify-between border-t border-b py-2 my-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" onClick={onLike} disabled={!currentUser}>
            <Heart
              className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            {likes.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => currentUser && setIsCommenting(!isCommenting)}
            disabled={!currentUser}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {isCommenting && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <RichTextEditor
            value={commentContent}
            onChange={setCommentContent}
            placeholder="Write your comment..."
          />
          <div className="mt-4">
            <MediaUploader
              onUploadComplete={(files) => setCommentMedia(files)}
              maxFiles={2}
              maxSizeMB={5}
              existingFiles={commentMedia}
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setIsCommenting(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!commentContent.trim() || isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      )}

      {comments.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Comments</h4>
          {comments.map((comment) => (
            <div key={comment.id} className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                <img
                  src={comment.authorPhoto || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                  <div>
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {currentUser && comment.authorId === currentUser.uid && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              {comment.media && comment.media.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {comment.media.map((url, index) => (
                    <div key={index} className="relative">
                      {url.includes('video') ? (
                        <video src={url} controls className="w-full rounded" />
                      ) : (
                        <img src={url} alt="" className="w-full rounded object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};