import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaSearch, FaFilter, FaComment, FaEye, FaThumbsUp, FaArrowLeft } from 'react-icons/fa';
import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { getAllPosts, getPostById, Post as ServicePost } from '../../../firebase/services/forums';
import { useAuth } from '../../../contexts/AuthContext';
import { Comment } from './types';
import NewPostModal from './NewPostModal';
import CommentBox from './CommentBox';
import MockupGallery from './MockupGallery';

// Extended Post type for UI display that includes UI-specific fields
interface UIPost extends ServicePost {
  content?: string; // Optional legacy field that maps to body
  body: string; // Content of the post
  user: { displayName: string; photoURL: string; email: string };
  tags?: string[];
  likes?: number;
  likedBy?: string[];
  commentCount?: number;
  views?: number;
}

const ForumsHome = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<UIPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const isRTL = i18n.language === 'ar';

  const popularTags = ['react', 'javascript', 'design', 'firebase', 'mobile', 'web'];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the getAllPosts service function
      const fetchedPosts = await getAllPosts();
      
      // Filter by tag if activeTag is set
      const filteredPosts = activeTag 
        ? fetchedPosts.filter(post => {
            // Safely check if post has tags and if it includes activeTag
            // Since tags is not in the ServicePost type, we use a type assertion
            const postWithTags = post as any;
            return Array.isArray(postWithTags.tags) && postWithTags.tags.includes(activeTag);
          })
        : fetchedPosts;
      
      // Map the posts to match the expected format in the UI
      const formattedPosts: UIPost[] = filteredPosts.map(post => {
        // Since tags is not in the ServicePost type, we use a type assertion
        const postWithTags = post as any;
        
        return {
          id: post.id || '',
          title: post.title,
          body: post.body || '', // Keep the body field for new UI
          content: post.body, // Keep content for backward compatibility
          userId: post.userId,
          userName: post.userName,
          createdAt: post.createdAt,
          // Create a user object from userName
          user: { 
            displayName: post.userName || 'Anonymous', 
            photoURL: '', 
            email: '' 
          },
          // Add UI-specific fields with default values
          tags: Array.isArray(postWithTags.tags) ? postWithTags.tags : [],
          likes: 0,
          likedBy: [],
          commentCount: 0,
          views: 0,
          imageURL: post.imageURL || ''
        };
      });
      
      setPosts(formattedPosts);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostClick = async (postId: string) => {
    try {
      setCommentsLoading(true);
      console.log('Fetching post details for ID:', postId);
      
      // Use the forums service to get the post
      const post = await getPostById(postId);
      console.log('Retrieved post data:', post);
      
      if (post) {
        // Create a UI-compatible post object with safe defaults for missing fields
        const postData: UIPost = {
          id: post.id || '',
          title: post.title,
          body: post.body || '', // Required field for UIPost
          content: post.body, // Keep for backward compatibility
          userId: post.userId,
          userName: post.userName,
          user: {
            displayName: post.userName || 'Anonymous',
            photoURL: '',
            email: ''
          },
          createdAt: post.createdAt,
          tags: [], // Default empty array since we don't have tags in Firestore
          likes: 0, // Default values for UI
          likedBy: [],
          commentCount: 0,
          views: 0,
          imageURL: post.imageURL || ''
        };
        
        console.log('Mapped post data for UI:', postData);
        
        // Fetch comments for this post
        const commentsQuery = query(
          collection(firestore, `forumsPosts/${postId}/comments`),
          orderBy('createdAt', 'desc')
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const fetchedComments = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        
        console.log('Fetched comments:', fetchedComments.length);
        
        try {
          // Update view count in Firestore - wrapped in try/catch in case this fails
          const postRef = doc(firestore, 'forumsPosts', postId);
          await updateDoc(postRef, {
            views: increment(1)
          });
          console.log('Updated view count in Firestore');
        } catch (viewErr) {
          console.error('Error updating view count:', viewErr);
          // Continue execution even if this fails
        }
        
        // Update the post with the latest data and increment view locally
        const updatedPost: UIPost = {
          ...postData,
          views: (postData.views || 0) + 1
        };
        
        setSelectedPost(updatedPost);
        setComments(fetchedComments);
        setIsNewPostModalOpen(false);
      } else {
        console.error('Post not found');
        setCommentsError(t('forums.postNotFound'));
      }
    } catch (err) {
      console.error('Error fetching post details:', err);
      setCommentsError(t('forums.errorFetchingComments'));
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!selectedPost || !currentUser) return;

    try {
      const commentData = {
        postId: selectedPost.id,
        userId: currentUser.uid,
        user: {
          displayName: currentUser.displayName || 'Anonymous',
          photoURL: currentUser.photoURL || '',
          email: currentUser.email || '',
        },
        content,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
      };

      // Add comment to the post's comments subcollection
      const commentsCollection = collection(firestore, `forumsPosts/${selectedPost.id}/comments`);
      await addDoc(commentsCollection, commentData);

      // Update comment count on post
      const postRef = doc(firestore, 'forumsPosts', selectedPost.id);
      await updateDoc(postRef, { commentCount: increment(1) });

      // Refresh comments
      const commentsQuery = query(
        collection(firestore, `forumsPosts/${selectedPost.id}/comments`),
        orderBy('createdAt', 'desc')
      );

      const commentsSnapshot = await getDocs(commentsQuery);
      const fetchedComments = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      setComments(fetchedComments);

      // Update local post data
      if (selectedPost) {
        setSelectedPost({
          ...selectedPost,
          commentCount: selectedPost.commentCount + 1,
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    setComments([]);
  };
  
  const handleLikeComment = async (commentId: string) => {
    if (!currentUser || !selectedPost) return;

    try {
      const commentRef = doc(firestore, `forumsPosts/${selectedPost.id}/comments`, commentId);
      const commentDoc = await getDoc(commentRef);

      if (commentDoc.exists()) {
        const commentData = commentDoc.data() as Comment;
        const isLiked = commentData.likedBy?.includes(currentUser.uid);

        if (isLiked) {
          // Unlike
          await updateDoc(commentRef, {
            likes: increment(-1),
            likedBy: commentData.likedBy.filter(uid => uid !== currentUser.uid)
          });
        } else {
          // Like
          await updateDoc(commentRef, {
            likes: increment(1),
            likedBy: [...(commentData.likedBy || []), currentUser.uid]
          });
        }

        // Refresh comments
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              likedBy: isLiked
                ? comment.likedBy.filter(uid => uid !== currentUser.uid)
                : [...comment.likedBy, currentUser.uid]
            };
          }
          return comment;
        }));
      }
    } catch (err) {
      console.error('Error liking/unliking comment:', err);
    }
  };

  const handleLikePost = async () => {
    if (!selectedPost || !currentUser) return;

    try {
      const postRef = doc(firestore, 'forumsPosts', selectedPost.id);
      
      if (selectedPost.likedBy.includes(currentUser.uid)) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: selectedPost.likedBy.filter(uid => uid !== currentUser.uid)
        });

        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes - 1,
          likedBy: selectedPost.likedBy.filter(uid => uid !== currentUser.uid)
        });
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: [...selectedPost.likedBy, currentUser.uid]
        });

        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes + 1,
          likedBy: [...selectedPost.likedBy, currentUser.uid]
        });
      }
    } catch (err) {
      console.error('Error liking/unliking post:', err);
    }
  };

  const handleNewComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
    if (selectedPost) {
        const postRef = doc(firestore, 'forumsPosts', selectedPost.id);
        updateDoc(postRef, { commentCount: increment(1) });
        setSelectedPost({
            ...selectedPost,
            commentCount: (selectedPost.commentCount || 0) + 1,
        });
    }
  };

  if (selectedPost) {
    return (
      <PostDetailsContainer $isRTL={isRTL}>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft /> {t('common.back')}
        </BackButton>
        <PostHeaderDetail>{selectedPost.title}</PostHeaderDetail>
        <PostContentDetail dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
        <PostMetaDetail>
          <AuthorInfo>
            <img src={selectedPost.user.photoURL} alt={selectedPost.user.displayName} />
            <span>{selectedPost.user.displayName}</span>
          </AuthorInfo>
          <PostStatsDetail>
            <StatItem><FaEye /> {selectedPost.views || 0}</StatItem>
            <StatItem><FaThumbsUp /> {selectedPost.likes || 0}</StatItem>
            <StatItem><FaComment /> {selectedPost.commentCount || 0}</StatItem>
          </PostStatsDetail>
        </PostMetaDetail>
        <Actions>
          <LikeButton onClick={handleLikePost} $liked={selectedPost.likedBy?.includes(currentUser?.uid)}>
            <FaThumbsUp /> {t('forums.like')}
          </LikeButton>
        </Actions>
        <CommentsSection>
          <h3>{t('forums.comments')}</h3>
          <CommentBox postId={selectedPost.id} onCommentAdded={handleNewComment} />
          {commentsLoading ? (
            <LoadingContainer><div>{t('common.loading')}</div></LoadingContainer>
          ) : commentsError ? (
            <ErrorContainer><div>{commentsError}</div></ErrorContainer>
          ) : (
            <CommentsList>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <CommentItem key={comment.id}>
                    <CommentHeader>
                      <img src={comment.user.photoURL} alt={comment.user.displayName} />
                      <strong>{comment.user.displayName}</strong>
                    </CommentHeader>
                    <CommentBody>{comment.content}</CommentBody>
                  </CommentItem>
                ))
              ) : (
                <NoCommentsMessage>{t('forums.noComments')}</NoCommentsMessage>
              )}
            </CommentsList>
          )}
        </CommentsSection>
      </PostDetailsContainer>
    );
  }

  return (
    <ForumsContainer $isRTL={isRTL}>
      <ForumsHeader>
        <h1>Forums</h1>
      </ForumsHeader>
      
      <ForumsLayout>
        <LeftColumn>
          <DiscussionHeader>
            <h2>Discussion Forum</h2>
            <NewPostButton onClick={() => setIsNewPostModalOpen(true)}>
              <FaPlus />
              Add Post
            </NewPostButton>
          </DiscussionHeader>
          {loading ? (
            <LoadingContainer>
              <div>{t('common.loading')}</div>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <div>{error}</div>
            </ErrorContainer>
          ) : (
            <PostsGrid>
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post.id} onClick={() => handlePostClick(post.id || '')}>
                    {post.imageURL && <PostThumbnail src={post.imageURL} alt={post.title} />}
                    <PostCardContent>
                      <PostTitle>{post.title}</PostTitle>
                      <PostContent>{post.body ? (post.body.substring(0, 100) + (post.body.length > 100 ? '...' : '')) : ''}</PostContent>
                      <PostMeta>
                        <Avatar src={post.user?.photoURL || '/default-avatar.png'} alt={post.user?.displayName || 'User'} />
                        <span>{post.user?.displayName || 'Anonymous'}</span>
                        <PostStats>
                          <StatItem>
                            <FaEye /> {post.views || 0}
                          </StatItem>
                          <StatItem>
                            <FaThumbsUp /> {post.likes || 0}
                          </StatItem>
                          <StatItem>
                            <FaComment /> {post.commentCount || 0}
                          </StatItem>
                        </PostStats>
                      </PostMeta>
                    </PostCardContent>
                  </PostCard>
                ))
              ) : (
                <p>{t('forums.noPosts')}</p>
              )}
            </PostsGrid>
          )}
        </LeftColumn>
        
        <RightColumn>
          <MockupGallery onAddMockup={() => setIsNewPostModalOpen(true)} />
        </RightColumn>
      </ForumsLayout>

      {isNewPostModalOpen && (
        <NewPostModal
          onClose={() => setIsNewPostModalOpen(false)}
          modalTitle="Add New Content"
          onSubmit={(newPost: any) => {
            // Add the new post to the posts array to avoid an extra fetch
            const uiPost: UIPost = {
              id: newPost.id,
              title: newPost.title,
              body: newPost.body || '', // Required field for UIPost
              content: newPost.body, // Keep for backward compatibility
              userId: newPost.userId,
              userName: newPost.userName,
              createdAt: newPost.createdAt,
              imageURL: newPost.imageURL || '',
              user: {
                displayName: newPost.userName,
                photoURL: '',
                email: ''
              },
              tags: newPost.tags || [],
              likes: 0,
              likedBy: [],
              commentCount: 0,
              views: 0
            };
            setPosts([uiPost, ...posts]);
            setIsNewPostModalOpen(false);
          }}
        />
      )}

      {/* Floating action button */}
      <FloatingButton onClick={() => setIsNewPostModalOpen(true)} title="Add New Post">
        <FaPlus />
      </FloatingButton>
    </ForumsContainer>
  );
};

const ForumsContainer = styled.div<{ $isRTL?: boolean }>`
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  padding: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ForumsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

const NewPostButton = styled.button`
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(123, 44, 191, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(123, 44, 191, 0.5);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(123, 44, 191, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 100;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(205, 62, 253, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(205, 62, 253, 0); }
    100% { box-shadow: 0 0 0 0 rgba(205, 62, 253, 0); }
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(123, 44, 191, 0.7);
    animation: none;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const TagPill = styled.div<{ $active?: boolean }>`
  background-color: ${props => props.$active ? 'rgba(123, 44, 191, 0.8)' : 'rgba(123, 44, 191, 0.1)'};
  color: ${props => props.$active ? 'white' : '#cd3efd'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  box-shadow: ${props => props.$active ? '0 4px 8px rgba(123, 44, 191, 0.3)' : 'none'};
  
  &:hover {
    background-color: ${props => props.$active ? 'rgba(123, 44, 191, 0.9)' : 'rgba(123, 44, 191, 0.2)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PostCard = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;


const PostThumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.3s ease;
`;

const PostCardContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(35, 38, 85, 0.6);
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  color: white;
  font-weight: 600;
`;

const PostContent = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  
  span {
    margin-left: 0.5rem;
    font-weight: 500;
    color: white;
  }
`;

const PostStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    color: #cd3efd;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  background: rgba(35, 38, 85, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  animation: pulse 1.5s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: #ff6b6b;
  background: rgba(35, 38, 85, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

// Styled components for Post Details view
const PostDetailsContainer = styled.div<{ $isRTL?: boolean }>`
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #82a1bf;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  &:hover {
    color: #513a52;
  }
`;

const PostHeaderDetail = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PostContentDetail = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 2rem;
`;

const PostMetaDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
  }
`;

const PostStatsDetail = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const Actions = styled.div`
  margin-bottom: 2rem;
`;

const LikeButton = styled.button<{ $liked?: boolean }>`
  background-color: ${props => props.$liked ? '#faaa93' : '#f0f0f0'};
  color: ${props => props.$liked ? 'white' : '#333'};
  border: 1px solid ${props => props.$liked ? '#faaa93' : '#ddd'};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CommentsSection = styled.div`
  h3 {
    margin-bottom: 1rem;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  strong {
    font-size: 0.9rem;
  }
`;

const CommentBody = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #444;
`;

const NoCommentsMessage = styled.p`
  color: #888;
  text-align: center;
  padding: 2rem;
`;



// Two-column layout styled components
const ForumsLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  animation: slideIn 0.5s ease-in-out;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: rgba(35, 38, 85, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DiscussionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default ForumsHome;
