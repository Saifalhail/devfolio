import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore as db } from '../../../firebase/config';
import { Post, Comment } from './types';
import NewPostModal from './NewPostModal';
import CommentBox from './CommentBox';
import { useAuth } from '../../../contexts/AuthContext';
import { FaEye, FaThumbsUp, FaComment, FaArrowLeft, FaPlus } from 'react-icons/fa';

const ForumsHome = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const isRTL = i18n.language === 'ar';

  const popularTags = ['react', 'javascript', 'design', 'firebase', 'mobile', 'web'];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let postsQuery;
      if (activeTag) {
        postsQuery = query(
          collection(db, 'posts'),
          where('tags', 'array-contains', activeTag),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } else {
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      }

      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data() as Post;
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          userId: data.userId,
          user: data.user,
          createdAt: data.createdAt,
          tags: data.tags,
          likes: data.likes,
          likedBy: data.likedBy,
          commentCount: data.commentCount,
          views: data.views,
          imageURL: data.imageURL,
        };
      });
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(t('forums.errorFetchingPosts'));
    } finally {
      setLoading(false);
    }
  }, [activeTag, t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostClick = async (postId: string) => {
    try {
      setCommentsLoading(true);
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postDocData = postDoc.data() as Post;
        const postData = {
          id: postDoc.id,
          title: postDocData.title,
          content: postDocData.content,
          userId: postDocData.userId,
          user: postDocData.user,
          createdAt: postDocData.createdAt,
          tags: postDocData.tags,
          likes: postDocData.likes,
          likedBy: postDocData.likedBy,
          commentCount: postDocData.commentCount,
          views: postDocData.views,
        };
        setSelectedPost(postData);

        await updateDoc(postRef, { views: increment(1) });

        const commentsQuery = query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('createdAt', 'desc')
        );

        const commentsSnapshot = await getDocs(commentsQuery);
        const fetchedComments = commentsSnapshot.docs.map(doc => {
          const data = doc.data() as Comment;
          return {
            id: doc.id,
            postId: data.postId,
            userId: data.userId,
            user: data.user,
            content: data.content,
            createdAt: data.createdAt,
            likes: data.likes,
            likedBy: data.likedBy,
          };
        });

        setComments(fetchedComments);
        setCommentsError(null);
      } else {
        setCommentsError(t('forums.postNotFound'));
      }
    } catch (err) {
      console.error('Error fetching post details:', err);
      setCommentsError(t('forums.errorFetchingPost'));
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    setComments([]);
  };

  const handleLikePost = async () => {
    if (!selectedPost || !currentUser) return;

    try {
      const postRef = doc(db, 'posts', selectedPost.id);
      const hasLiked = selectedPost.likedBy?.includes(currentUser.uid);

      if (hasLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: selectedPost.likedBy.filter(id => id !== currentUser.uid)
        });
        setSelectedPost({
          ...selectedPost,
          likes: (selectedPost.likes || 1) - 1,
          likedBy: selectedPost.likedBy.filter(id => id !== currentUser.uid)
        });
      } else {
        const newLikedBy = [...(selectedPost.likedBy || []), currentUser.uid];
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: newLikedBy
        });
        setSelectedPost({
          ...selectedPost,
          likes: (selectedPost.likes || 0) + 1,
          likedBy: newLikedBy
        });
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleNewComment = (newComment: Comment) => {
    setComments([newComment, ...comments]);
    if (selectedPost) {
        const postRef = doc(db, 'posts', selectedPost.id);
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
        <h1>{t('forums.title')}</h1>
        <NewPostButton onClick={() => setNewPostModalOpen(true)} >
          {t('forums.newPost')}
        </NewPostButton>
      </ForumsHeader>

      <TagsContainer>
        {popularTags.map(tag => (
          <TagPill
            key={tag}
            $active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            #{tag}
          </TagPill>
        ))}
      </TagsContainer>

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
              <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
                {post.imageURL && <PostThumbnail src={post.imageURL} alt={post.title} />}
                <PostCardContent>
                  <PostTitle>{post.title}</PostTitle>
                  <PostContent>{post.content ? post.content.substring(0, 100) + '...' : (post.body ? post.body.substring(0,100)+'...' : '')}</PostContent>
                  <PostMeta>
                    <Avatar src={post.user?.photoURL} alt={post.user?.displayName} />
                    <span>{post.user.displayName}</span>
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

      {isNewPostModalOpen && (
        <NewPostModal
          onClose={() => setNewPostModalOpen(false)}
          onSubmit={() => {
            setNewPostModalOpen(false);
            fetchPosts();
          }}
        />
      )}

      {/* Floating action button */}
      <FloatingButton onClick={() => setNewPostModalOpen(true)}>
        <FaPlus />
      </FloatingButton>
    </ForumsContainer>
  );
};

const ForumsContainer = styled.div<{ $isRTL?: boolean }>`
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ForumsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;

const NewPostButton = styled.button`
  background-color: #82a1bf;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #513a52;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #faaa93;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  &:hover {
    background-color: #513a52;
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const TagPill = styled.div<{ $active?: boolean }>`
  background-color: ${props => props.$active ? '#82a1bf' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? '#513a52' : '#e0e0e0'};
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #82a1bf transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #82a1bf;
    border-radius: 6px;
  }
`;


const PostCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.05);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #82a1bf;
  }
`;


const PostThumbnail = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
`;

const PostCardContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  color: #333;
`;

const PostContent = styled.p`
  font-size: 0.875rem;
  color: #666;
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
  color: #999;
  
  span {
    margin-left: 0.5rem;
    font-weight: 500;
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
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: red;
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

export default ForumsHome;
