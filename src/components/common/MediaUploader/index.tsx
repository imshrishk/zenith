import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import { MediaPreview } from './MediaPreview';
import { UploadProgress } from './UploadProgress';
import type { UploadedFile } from './types';

interface MediaUploaderProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  existingFiles?: UploadedFile[];
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  maxFiles = 5,
  maxSizeMB = 10,
  className = '',
  existingFiles = []
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            type: fileType,
            name: file.name
          });
        }
      );
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setIsUploading(true);
      setError(null);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File size should not exceed ${maxSizeMB}MB`);
          }
          return await uploadFile(file);
        });
        const uploadedFiles = await Promise.all(uploadPromises);
        const newFiles = [...files, ...uploadedFiles];
        setFiles(newFiles);
        onUploadComplete(newFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [files, maxFiles, maxSizeMB, onUploadComplete]
  );

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: maxFiles - files.length,
    disabled: isUploading
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            {isDragActive
              ? 'Drop your files here'
              : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports: Images (PNG, JPG, GIF) and Videos (MP4, WebM, OGG) up to {maxSizeMB}MB
          </p>
        </div>
      </div>
      {isUploading && (
        <div className="mt-4">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <UploadProgress key={fileName} progress={progress} />
          ))}
        </div>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Uploaded files ({files.length}/{maxFiles})
          </div>
          <div className="grid grid-cols-4 gap-2">
            {files.map((file, index) => (
              <MediaPreview
                key={file.url}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
