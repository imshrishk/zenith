import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  joinDate: Timestamp;
}

export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  question: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
  answers: Answer[];
}

export interface Answer {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
}

export interface Thread {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
  comments: Comment[];
  tags: string[];
  media: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
  media: string[];
}

export interface UploadedFile {
  url: string;
  type: 'image' | 'video';
  name: string;
}