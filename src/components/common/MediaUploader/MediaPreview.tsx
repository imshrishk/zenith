import React from 'react';
import { X } from 'lucide-react';
import type { UploadedFile } from './types';

interface MediaPreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onRemove }) => {
  return (
    <div className="relative group">
      {file.type === 'video' ? (
        <video
          src={file.url}
          className="h-20 w-20 object-cover rounded-md"
          controls
        />
      ) : (
        <img
          src={file.url}
          alt={file.name}
          className="h-20 w-20 object-cover rounded-md"
        />
      )}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};