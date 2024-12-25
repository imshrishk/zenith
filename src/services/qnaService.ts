import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  orderBy,
  type QueryDocumentSnapshot,
  FirestoreError
} from 'firebase/firestore';
import type { Question, Answer } from '../types/firebase';

export const getQuestions = async (): Promise<Question[]> => {
  try {
    const questionsQuery = query(
      collection(db, 'questions'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(questionsQuery);
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ?? serverTimestamp()
    })) as Question[];
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
};

export const createQuestion = async (
  userId: string,
  userName: string,
  userPhoto: string,
  question: string,
  content: string
): Promise<string> => {
  try {
    const questionData = {
      authorId: userId,
      authorName: userName,
      authorPhoto: userPhoto,
      question,
      content,
      createdAt: serverTimestamp(),
      likes: [],
      answers: []
    };

    const docRef = await addDoc(collection(db, 'questions'), questionData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating question:', error);
    throw new Error('Failed to create question');
  }
};

export const likeQuestion = async (questionId: string, userId: string): Promise<void> => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      likes: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error liking question:', error);
    throw new Error('Failed to like question');
  }
};

export const unlikeQuestion = async (questionId: string, userId: string): Promise<void> => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, {
      likes: arrayRemove(userId)
    });
  } catch (error) {
    console.error('Error unliking question:', error);
    throw new Error('Failed to unlike question');
  }
};

export const addAnswer = async (
  questionId: string,
  userId: string,
  userName: string,
  userPhoto: string,
  content: string
): Promise<void> => {
  if (!questionId || !userId || !content) {
    throw new Error('Missing required fields for answer');
  }

  try {
    const questionRef = doc(db, 'questions', questionId);
    const answer: Answer = {
      id: crypto.randomUUID(),
      authorId: userId,
      authorName: userName,
      authorPhoto: userPhoto,
      content,
      createdAt: new Date(),
      likes: []
    };

    await updateDoc(questionRef, {
      answers: arrayUnion({
        ...answer,
        createdAt: new Date()
      })
    });
  } catch (error) {
    if (error instanceof FirestoreError) {
      throw new Error(`Firebase error: ${error.message}`);
    }
    throw error;
  }
};