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
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore, auth, storage } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Compress an image file to ensure it fits within Firestore's size limits
 * @param file The image file to compress
 * @param maxSizeKB Maximum size in KB (default 400KB to stay well under 1MB Firestore limit)
 * @returns Promise<string> Base64 encoded compressed image
 */
const compressImageToBase64 = async (file: File, maxSizeKB: number = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to reduce file size - be more aggressive
      let { width, height } = img;
      const maxDimension = 800; // Reduced from 1200 to 800 for smaller file sizes
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels until we get under the size limit
        let quality = 0.6; // Start with lower quality
        let base64 = '';
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryCompress = () => {
          attempts++;
          base64 = canvas.toDataURL('image/jpeg', quality);
          
          // Calculate actual base64 size in KB
          const base64SizeKB = (base64.length * 3) / 4 / 1024;
          
          console.log(`📐 Compression attempt ${attempts}: ${Math.round(width)}x${Math.round(height)}, Quality: ${quality.toFixed(2)}, Size: ${Math.round(base64SizeKB)}KB (Target: ${maxSizeKB}KB)`);
          
          if (base64SizeKB > maxSizeKB && quality > 0.05 && attempts < maxAttempts) {
            // If still too large, reduce quality more aggressively
            quality = quality > 0.3 ? quality - 0.1 : quality - 0.05;
            
            // If quality gets too low, try reducing dimensions further
            if (quality <= 0.1 && (width > 400 || height > 400)) {
              const scaleFactor = 0.8;
              width = Math.floor(width * scaleFactor);
              height = Math.floor(height * scaleFactor);
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              quality = 0.5; // Reset quality when reducing dimensions
              console.log(`🔄 Reducing dimensions to ${width}x${height}`);
            }
            
            tryCompress();
          } else {
            console.log(`✅ Final compressed image: ${Math.round(base64SizeKB)}KB`);
            resolve(base64);
          }
        };
        
        tryCompress();
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Helper function to wait for auth to be ready
 */
const waitForAuth = (): Promise<any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

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
  commentCount?: number;
}

export interface Comment {
  id?: string;
  commentText: string;
  userId: string;
  userName: string;
  createdAt?: Timestamp;
}

export interface MockupComment {
  id?: string;
  content: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhotoURL?: string;
  coordinates: {
    x: number; // Pixel coordinates relative to image container
    y: number;
  };
  createdAt?: Timestamp;
  likes?: number;
  likedBy?: string[];
}

/**
 * Internal helpers -----------------------------------------------
 */
// Use the firestore instance from config
// Updated to use projectDiscussions collection as per new security rules
const postsCollection = (projectId: string = 'default'): CollectionReference<DocumentData> =>
  collection(firestore, `projectDiscussions/${projectId}/messages`);

const commentsCollection = (projectId: string, messageId: string): CollectionReference<DocumentData> =>
  collection(firestore, `projectDiscussions/${projectId}/messages/${messageId}/comments`);

const mockupCommentsCollection = (projectId: string, mockupId: string): CollectionReference<DocumentData> =>
  collection(firestore, `projects/${projectId}/mockups/${mockupId}/comments`);

/**
 * Upload a file to Firebase Storage and return its download URL
 * @param file The file to upload
 * @param onProgress Optional callback for upload progress (0-100)
 */
export const uploadImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  if (!file) throw new Error('No file provided');
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }
  
  const fileRef = ref(storage, `forumImages/${uuidv4()}_${file.name}`);
  
  try {
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
          console.error('Upload progress error:', error);
          throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
        }
      );
      
      // Wait for upload to complete
      await uploadTask;
    } else {
      // Simple upload without progress tracking
      await uploadBytes(fileRef, file);
    }
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log('✅ Image uploaded successfully, download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        throw new Error('Permission denied to upload image. Please check your login status.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error during image upload. Please check your internet connection.');
      } else if (error.message.includes('storage')) {
        throw new Error('Storage service error. Please try again later.');
      }
    }
    
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new forum post. If an image is provided it will be uploaded first.
 * @param projectId - Project ID, defaults to 'default'
 * @param post - The post data to create
 * @param image - Optional image file to upload
 */
export const createPost = async (projectId: string = 'default', post: Post, image?: File): Promise<string> => {
  // Verify user is authenticated
  console.log('createPost called - checking authentication...');
  console.log('Auth instance:', auth);
  console.log('Auth currentUser:', auth.currentUser);
  
  let currentUser = auth.currentUser;
  
  // If currentUser is null, wait for auth state to be determined
  if (!currentUser) {
    console.log('Auth currentUser is null, waiting for auth state...');
    currentUser = await waitForAuth();
  }
  
  if (!currentUser) {
    console.error("User not authenticated - auth.currentUser is null even after waiting");
    console.error("Make sure you're logged in before trying to create a post");
    throw new Error("User must be authenticated to create a post");
  }
  
  console.log('User authenticated:', currentUser.email, currentUser.uid);
  
  let imageURL = post.imageURL || '';
  if (image) {
    console.log('🖼️ Uploading image to Firebase Storage...');
    try {
      // Add timeout for image upload (20 seconds)
      const uploadPromise = uploadImage(image);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timed out after 20 seconds')), 20000);
      });
      
      imageURL = await Promise.race([uploadPromise, timeoutPromise]);
      console.log('✅ Image uploaded, URL:', imageURL);
    } catch (error) {
      console.error('⚠️ Storage upload failed, using compressed base64 fallback:', error);
      
      try {
        // Fallback: Convert image to compressed base64 for development
        console.log('🔄 Compressing image for Firestore storage...');
        // Use smaller target to ensure it fits in Firestore (1MB limit)
        imageURL = await compressImageToBase64(image, 300); // Target 300KB, becomes ~400KB after base64
        console.log('✅ Using compressed base64 image for development');
      } catch (compressionError) {
        console.error('❌ Image compression failed:', compressionError);
        throw new Error('Failed to process image. Please try with a smaller image file.');
      }
    }
  }

  // Create a post object that exactly matches the Firestore structure we observed
  const postData = {
    title: post.title,
    body: post.body,
    userId: currentUser.uid,
    userName: currentUser.displayName || 'Anonymous',
    imageURL,
    createdAt: Timestamp.now(),
    views: 0,
    likes: 0,
    likedBy: [],
    commentCount: 0
  };

  try {
    console.log(`Creating post in project ${projectId}:`, postData);
    const docRef = await addDoc(postsCollection(projectId), postData);
    return docRef.id;
  } catch (err) {
    console.error(`Error creating post in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Fetch every forum post ordered by creation date desc.
 * @param projectId - Optional project ID, defaults to 'default'
 */
export const getAllPosts = async (projectId: string = 'default'): Promise<Post[]> => {
  try {
    console.log(`Fetching posts from collection: projectDiscussions/${projectId}/messages`);
    console.log('Current auth state:', auth.currentUser ? 'Authenticated' : 'Not authenticated');
    
    // Use the updated collection reference with projectId
    const q = query(postsCollection(projectId), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    console.log(`Successfully fetched ${snapshot.docs.length} posts for project ${projectId}`);
    
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
  } catch (error) {
    console.error(`Error fetching posts for project ${projectId}:`, error);
    // Re-throw with more context for better debugging
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Retrieve a single post document by id
 * @param projectId - Project ID, defaults to 'default'
 * @param postId - The ID of the post to retrieve
 */
export const getPostById = async (projectId: string = 'default', postId: string): Promise<Post | null> => {
  try {
    const docRef = doc(firestore, `projectDiscussions/${projectId}/messages`, postId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as Post) };
  } catch (err) {
    console.error(`Error retrieving post ${postId} from project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Add a comment to a post
 * @param projectId - Project ID, defaults to 'default'
 * @param postId - The ID of the post to add a comment to
 * @param comment - The comment data to add
 */
export const addComment = async (projectId: string = 'default', postId: string, comment: Comment): Promise<string> => {
  try {
    const data: Comment = {
      ...comment,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(commentsCollection(projectId, postId), data);
    return docRef.id;
  } catch (err) {
    console.error(`Error adding comment to post ${postId} in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Get all comments for a post
 * @param projectId - Project ID, defaults to 'default'
 * @param postId - The ID of the post to get comments for
 */
export const getComments = async (projectId: string = 'default', postId: string): Promise<Comment[]> => {
  try {
    const q = query(commentsCollection(projectId, postId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Comment) }));
  } catch (err) {
    console.error(`Error getting comments for post ${postId} in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * MOCKUP COMMENT SERVICES
 * Functions for managing comments on mockups with coordinate positioning
 */

/**
 * Add a comment to a mockup with coordinate positioning
 * @param projectId - Project ID, defaults to 'default'
 * @param mockupId - The ID of the mockup to add a comment to
 * @param comment - The mockup comment data to add
 */
export const addMockupComment = async (projectId: string = 'default', mockupId: string, comment: MockupComment): Promise<string> => {
  // Verify user is authenticated
  let currentUser = auth.currentUser;
  
  // If currentUser is null, wait for auth state to be determined
  if (!currentUser) {
    console.log('Auth currentUser is null, waiting for auth state...');
    currentUser = await waitForAuth();
  }
  
  if (!currentUser) {
    console.error("User not authenticated");
    throw new Error("User must be authenticated to add a comment");
  }

  try {
    const data: MockupComment = {
      content: comment.content,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous',
      userEmail: currentUser.email || '',
      userPhotoURL: currentUser.photoURL || '',
      coordinates: {
        x: comment.coordinates.x,
        y: comment.coordinates.y
      },
      createdAt: Timestamp.now(),
      likes: 0,
      likedBy: []
    };

    console.log(`Adding mockup comment to project ${projectId}, mockup ${mockupId}:`, data);
    const docRef = await addDoc(mockupCommentsCollection(projectId, mockupId), data);
    
    return docRef.id;
  } catch (err) {
    console.error(`Error adding comment to mockup ${mockupId} in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Get all comments for a mockup
 * @param projectId - Project ID, defaults to 'default'
 * @param mockupId - The ID of the mockup to get comments for
 */
export const getMockupComments = async (projectId: string = 'default', mockupId: string): Promise<MockupComment[]> => {
  try {
    console.log(`Fetching mockup comments from: projects/${projectId}/mockups/${mockupId}/comments`);
    
    const q = query(mockupCommentsCollection(projectId, mockupId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    console.log(`Successfully fetched ${snapshot.docs.length} comments for mockup ${mockupId}`);
    
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as MockupComment) }));
  } catch (err) {
    console.error(`Error getting comments for mockup ${mockupId} in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Update a mockup comment (for likes, etc.)
 * @param projectId - Project ID, defaults to 'default'
 * @param mockupId - The ID of the mockup
 * @param commentId - The ID of the comment to update
 * @param updates - The fields to update
 */
export const updateMockupComment = async (
  projectId: string = 'default', 
  mockupId: string, 
  commentId: string, 
  updates: Partial<MockupComment>
): Promise<void> => {
  try {
    const docRef = doc(firestore, `projects/${projectId}/mockups/${mockupId}/comments`, commentId);
    await updateDoc(docRef, {
      ...updates,
      // Don't allow updating certain fields
      createdAt: undefined,
      userId: undefined,
      id: undefined
    });
    
    console.log(`Updated mockup comment ${commentId} in project ${projectId}, mockup ${mockupId}`);
  } catch (err) {
    console.error(`Error updating comment ${commentId} for mockup ${mockupId} in project ${projectId}:`, err);
    throw err;
  }
};

/**
 * Delete a mockup comment
 * @param projectId - Project ID, defaults to 'default'
 * @param mockupId - The ID of the mockup
 * @param commentId - The ID of the comment to delete
 */
export const deleteMockupComment = async (projectId: string = 'default', mockupId: string, commentId: string): Promise<void> => {
  // Verify user is authenticated
  let currentUser = auth.currentUser;
  
  // If currentUser is null, wait for auth state to be determined
  if (!currentUser) {
    console.log('Auth currentUser is null, waiting for auth state...');
    currentUser = await waitForAuth();
  }
  
  if (!currentUser) {
    throw new Error("User must be authenticated to delete a comment");
  }

  try {
    const docRef = doc(firestore, `projects/${projectId}/mockups/${mockupId}/comments`, commentId);
    
    // Get the comment to verify ownership
    const commentDoc = await getDoc(docRef);
    if (!commentDoc.exists()) {
      throw new Error("Comment not found");
    }
    
    const commentData = commentDoc.data() as MockupComment;
    if (commentData.userId !== currentUser.uid) {
      throw new Error("You can only delete your own comments");
    }
    
    await deleteDoc(docRef);
    console.log(`Deleted mockup comment ${commentId} from project ${projectId}, mockup ${mockupId}`);
  } catch (err) {
    console.error(`Error deleting comment ${commentId} for mockup ${mockupId} in project ${projectId}:`, err);
    throw err;
  }
};
