export interface UploadedFile {
    url: string;
    type: 'image' | 'video';
    name: string;
  }
  
  export interface MediaUploaderProps {
    onUploadComplete: (files: UploadedFile[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    className?: string;
    existingFiles?: UploadedFile[];
  }
  
  export interface MediaPreviewProps {
    file: UploadedFile;
    onRemove: () => void;
  }
  
  export interface UploadProgressProps {
    progress: number;
  }