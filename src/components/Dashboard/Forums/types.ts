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
  commentCount: number;
  imageURL?: string;
  views: number;
  isPinned?: boolean;
  isLocked?: boolean;
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
