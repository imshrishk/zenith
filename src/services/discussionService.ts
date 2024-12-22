import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDocs,
  type QueryDocumentSnapshot,
  type Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Thread, Comment } from '../types/firebase';

interface ThreadData {
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp;
  likes: string[];
  comments: [];
  media: string[];
}

export const createThread = async (
  authorId: string,
  authorName: string,
  authorPhoto: string,
  title: string,
  content: string,
  tags: string[],
  media: string[] = []
): Promise<string> => {
  try {
    const threadData = {
      authorId,
      authorName,
      authorPhoto,
      title,
      content,
      tags,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
      media,
    };
    const threadRef = await addDoc(collection(db, 'threads'), threadData);
    return threadRef.id;
  } catch (error) {
    throw new Error('Failed to create thread');
  }
};

export const addComment = async (
  threadId: string,
  userId: string,
  userName: string,
  userPhoto: string,
  content: string,
  media: string[] = []
): Promise<void> => {
  if (!threadId || !userId || !content) {
    throw new Error('Missing required fields for comment');
  }

  try {
    const threadRef = doc(db, 'threads', threadId);
    
    // Verify thread exists
    const threadDoc = await getDocs(query(collection(db, 'threads')));
    const thread = threadDoc.docs.find(doc => doc.id === threadId);
    
    if (!thread) {
      throw new Error('Thread not found');
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      authorId: userId,
      authorName: userName,
      authorPhoto: userPhoto,
      content,
      createdAt: serverTimestamp() as Timestamp,
      likes: [],
      media
    };

    await updateDoc(threadRef, {
      comments: arrayUnion(comment)
    });
  } catch (error) {
    if (error instanceof FirestoreError) {
      throw new Error(`Firebase error: ${error.message}`);
    }
    throw error;
  }
};

export const getThreads = async (): Promise<Thread[]> => {
  try {
    const threadsQuery = query(
      collection(db, 'threads'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(threadsQuery);
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ?? serverTimestamp()
    })) as Thread[];
  } catch (error) {
    throw new Error('Failed to fetch threads');
  }
};

export const likeComment = async (
  threadId: string,
  commentId: string,
  userId: string
): Promise<void> => {
  try {
    const threadRef = doc(db, 'threads', threadId);
    const thread = (await getDocs(query(collection(db, 'threads')))).docs
      .find(doc => doc.id === threadId)?.data() as Thread;
    
    if (!thread) throw new Error('Thread not found');
    
    const updatedComments = thread.comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likes.includes(userId) 
            ? comment.likes.filter(id => id !== userId)
            : [...comment.likes, userId]
        };
      }
      return comment;
    });
    
    await updateDoc(threadRef, { comments: updatedComments });
  } catch (error) {
    throw new Error('Failed to update comment like');
  }
};

export const likeThread = async (threadId: string, userId: string): Promise<void> => {
  try {
    const threadRef = doc(db, 'threads', threadId);
    await updateDoc(threadRef, {
      likes: arrayUnion(userId)
    });
  } catch (error) {
    throw new Error('Failed to like thread');
  }
};

export const unlikeThread = async (threadId: string, userId: string): Promise<void> => {
  try {
    const threadRef = doc(db, 'threads', threadId);
    await updateDoc(threadRef, {
      likes: arrayRemove(userId)
    });
  } catch (error) {
    throw new Error('Failed to unlike thread');
  }
};