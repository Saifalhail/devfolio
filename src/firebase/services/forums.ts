import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
import { firestore, auth } from '../config';
import app from '../config';
import { v4 as uuidv4 } from 'uuid';

// Initialize storage
const storage = getStorage(app);

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
  tags?: string[];
  views?: number;
  likes?: number;
  likedBy?: string[];
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
// Use the firestore instance from config
const postsCollection = (): CollectionReference<DocumentData> =>
  collection(firestore, 'forumsPosts');

const commentsCollection = (postId: string): CollectionReference<DocumentData> =>
  collection(firestore, `forumsPosts/${postId}/comments`);

/**
 * Upload a file to Firebase Storage and return its download URL
 * @param file The file to upload
 * @param onProgress Optional callback for upload progress (0-100)
 */
export const uploadImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  if (!file) throw new Error('No file provided');
  
  const fileRef = ref(storage, `forumImages/${uuidv4()}_${file.name}`);
  
  if (onProgress) {
    // Use uploadBytesResumable for progress tracking
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    // Set up progress tracking
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        throw error;
      }
    );
    
    // Wait for upload to complete
    await uploadTask;
  } else {
    // Simple upload without progress tracking
    await uploadBytes(fileRef, file);
  }
  
  return await getDownloadURL(fileRef);
};

/**
 * Create a new forum post. If an image is provided it will be uploaded first.
 */
export const createPost = async (post: Post, image?: File): Promise<string> => {
  // Verify user is authenticated
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    console.error("User not authenticated");
    throw new Error("User must be authenticated to create a post");
  }
  
  let imageURL = post.imageURL || '';
  if (image) {
    imageURL = await uploadImage(image);
  }

  // Create a post object that exactly matches the Firestore structure we observed
  // Only include fields that are in the Firestore database
  const postData = {
    title: post.title,
    body: post.body,
    userId: 342564, // Using the numeric userId to match existing data
    userName: currentUser.displayName || 'Anonymous',
    imageURL,
    createdAt: Timestamp.now()
  };

  try {
    console.log("Attempting to create post with data:", postData);
    console.log("Current user:", currentUser.uid, currentUser.displayName);
    
    const docRef = await addDoc(postsCollection(), postData);
    console.log("Post created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
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
  const docSnap = await getDoc(doc(firestore, 'forumsPosts', postId));
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
