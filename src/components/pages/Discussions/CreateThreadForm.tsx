import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { RichTextEditor } from '../../common/RichTextEditor';
import { MediaUploader } from '../../common/MediaUploader';

interface CreateThreadFormProps {
  onSubmit: (data: { title: string; content: string; tags: string[]; media: string[] }) => void;
  onCancel: () => void;
}

export const CreateThreadForm: React.FC<CreateThreadFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      media
    });
  };

  const handleMediaUpload = (url: string) => {
    setMedia(prev => [...prev, url]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your post..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Media
          </label>
          <MediaUploader onUpload={handleMediaUpload} />
          {media.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {media.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setMedia(prev => prev.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="meditation, mindfulness, practice"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Thread
        </Button>
      </div>
    </form>
  );
};

// src/components/pages/Discussions/ThreadCard.tsx
// (Update the imports and interfaces sections)
interface ThreadCardProps {
  id: string;
  title: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  media: string[];
  createdAt: any;
  likes: string[];
  comments: Comment[];
  tags: string[];
  currentUser: User | null;
  onLike: () => Promise<void>;
  onComment: (content: string) => Promise<void>;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  // ... existing props
  media,
  onComment
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await onComment(commentContent);
    setCommentContent('');
    setIsCommenting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Existing header section */}
      
      <div className="prose max-w-none mb-4" 
           dangerouslySetInnerHTML={{ __html: content }} 
      />

      {media && media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {media.map((url, index) => (
            <div key={index} className="relative">
              {url.includes('video') ? (
                <video
                  src={url}
                  controls
                  className="w-full rounded"
                />
              ) : (
                <img
                  src={url}
                  alt=""
                  className="w-full rounded object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Existing tags section */}

      <div className="flex items-center justify-between">
        {/* Existing action buttons */}
      </div>

      {isCommenting && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <RichTextEditor
            value={commentContent}
            onChange={setCommentContent}
            placeholder="Write your comment..."
          />
          <div className="flex justify-end space-x-4 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsCommenting(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Comment</Button>
          </div>
        </form>
      )}

      {comments.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Comments</h4>
          {comments.map((comment) => (
            <div key={comment.id} className="border-t pt-4">
              <div className="flex items-center mb-2">
                <img
                  src={comment.authorPhoto || '/default-avatar.png'}
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDistanceToNow(comment.createdAt.toDate(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="prose max-w-none"
                   dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};