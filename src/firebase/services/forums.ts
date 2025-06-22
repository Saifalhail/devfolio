import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { getFirestoreDb, getStorageInstance } from '../../firebase';

/**
 * Types -----------------------------------------------------------
 */
export interface Post {
  id?: string;
  title: string;
  body: string;
  imageURL?: string;
  userId: string;
  userName: string;
  createdAt?: Timestamp;
}

export interface Comment {
  id?: string;
  commentText: string;
  userId: string;
  userName: string;
  createdAt?: Timestamp;
}

/**
 * Internal helpers -----------------------------------------------
 */
const db = getFirestoreDb();
const storage = getStorageInstance();

const postsCollection = (): CollectionReference<DocumentData> =>
  collection(db, 'forumsPosts');

const commentsCollection = (postId: string): CollectionReference<DocumentData> =>
  collection(db, `forumsPosts/${postId}/comments`);

/**
 * Upload a file to Firebase Storage and return its download URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error('No file provided');
  const fileRef = ref(storage, `forumImages/${uuidv4()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

/**
 * Create a new forum post. If an image is provided it will be uploaded first.
 */
export const createPost = async (post: Post, image?: File): Promise<string> => {
  let imageURL = post.imageURL || '';
  if (image) {
    imageURL = await uploadImage(image);
  }

  const postData: Post = {
    ...post,
    imageURL,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(postsCollection(), postData);
  return docRef.id;
};

/**
 * Fetch every forum post ordered by creation date desc.
 */
export const getAllPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection(), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
};

/**
 * Retrieve a single post document by id
 */
export const getPostById = async (postId: string): Promise<Post | null> => {
  const docSnap = await getDoc(doc(db, 'forumsPosts', postId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as Post) };
};

/**
 * Add a comment document under a post's `comments` subcollection
 */
export const addComment = async (postId: string, comment: Comment): Promise<string> => {
  const data: Comment = {
    ...comment,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(commentsCollection(postId), data);
  return docRef.id;
};

/**
 * Get all comments for a post ordered by creation date asc
 */
export const getComments = async (postId: string): Promise<Comment[]> => {
  const q = query(commentsCollection(postId), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Comment) }));
};
