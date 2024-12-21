import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import type { Question, Answer } from '../types/firebase';

export const getQuestions = async (): Promise<Question[]> => {
  const questionsRef = collection(db, 'questions');
  const q = query(questionsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Question[];
};

export const createQuestion = async (
  userId: string,
  userName: string,
  userPhoto: string,
  question: string,
  content: string
) => {
  const questionsRef = collection(db, 'questions');
  await addDoc(questionsRef, {
    authorId: userId,
    authorName: userName,
    authorPhoto: userPhoto,
    question,
    content,
    createdAt: Timestamp.now(),
    likes: [],
    answers: [],
  });
};

export const likeQuestion = async (questionId: string, userId: string) => {
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, {
    likes: arrayUnion(userId),
  });
};

export const unlikeQuestion = async (questionId: string, userId: string) => {
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, {
    likes: arrayRemove(userId),
  });
};

export const addAnswer = async (
  questionId: string,
  userId: string,
  userName: string,
  userPhoto: string,
  content: string
) => {
  const questionRef = doc(db, 'questions', questionId);
  const answer: Omit<Answer, 'id'> & { id: string } = {
    id: crypto.randomUUID(),
    authorId: userId,
    authorName: userName,
    authorPhoto: userPhoto,
    content,
    createdAt: Timestamp.now(),
    likes: [],
  };
  await updateDoc(questionRef, {
    answers: arrayUnion(answer),
  });
};