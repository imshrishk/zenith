import React, { lazy, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';

// Lazy load ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image', 'video'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder
}) => {
  return (
    <Suspense fallback={<div className="h-48 mb-12 bg-gray-100 animate-pulse rounded-md"/>}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-48 mb-12"
      />
    </Suspense>
  );
};