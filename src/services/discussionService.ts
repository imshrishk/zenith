import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Thread, Comment } from '../types/firebase';

export const createThread = async (
  authorId: string,
  authorName: string,
  authorPhoto: string,
  title: string,
  content: string,
  tags: string[]
) => {
  try {
    const threadRef = await addDoc(collection(db, 'threads'), {
      authorId,
      authorName,
      authorPhoto,
      title,
      content,
      tags,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
    });
    return threadRef.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const getThreads = async () => {
  try {
    const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
  } catch (error) {
    console.error('Error getting threads:', error);
    throw error;
  }
};

export const likeThread = async (threadId: string, userId: string) => {
  const threadRef = doc(db, 'threads', threadId);
  await updateDoc(threadRef, {
    likes: arrayUnion(userId)
  });
};

export const unlikeThread = async (threadId: string, userId: string) => {
  const threadRef = doc(db, 'threads', threadId);
  await updateDoc(threadRef, {
    likes: arrayRemove(userId)
  });
};

export const addComment = async (
  threadId: string,
  authorId: string,
  authorName: string,
  authorPhoto: string,
  content: string
) => {
  const threadRef = doc(db, 'threads', threadId);
  const comment: Omit<Comment, 'id'> = {
    authorId,
    authorName,
    authorPhoto,
    content,
    createdAt: serverTimestamp() as any,
    likes: [],
  };
  await updateDoc(threadRef, {
    comments: arrayUnion(comment)
  });
};