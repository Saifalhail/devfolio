export interface User {
  id: string;
  displayName: string;
  photoURL?: string;
  email: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  likes: number;
  likedBy: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: User;
  createdAt: Date | string;
  updatedAt?: Date | string;
  tags: string[];
  likes: number;
  likedBy: string[];
}

export interface Mockup {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  userId: number;
  userName: string;
  createdAt: Date | string;
  commentCount?: number;
  views?: number;
}

export interface MockupComment {
  id: string;
  mockupId: string;
  commentText: string;
  userId: number;
  userName: string;
  createdAt: Date | string;
}

export interface ForumState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  selectedPost: Post | null;
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string | null;
}
