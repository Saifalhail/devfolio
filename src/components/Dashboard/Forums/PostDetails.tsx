import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { firestore as db } from '../../../firebase/config';
import { Post, Comment } from './types';
import CommentBox from './CommentBox';
import { useAuth } from '../../../contexts/AuthContext';

const PostDetails = () => {
  const { t, i18n } = useTranslation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isRTL = i18n.language === 'ar';

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = { id: postDoc.id, ...postDoc.data() } as Post;
          setPost(postData);
          
          // Increment view count
          await updateDoc(postRef, {
            views: increment(1)
          });
        } else {
          setError(t('forums.postNotFound'));
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(t('forums.errorFetchingPost'));
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!postId) return;

      try {
        setCommentsLoading(true);
        const commentsQuery = query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('createdAt', 'asc')
        );
        
        const snapshot = await getDocs(commentsQuery);
        const fetchedComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        
        setComments(fetchedComments);
        setCommentsError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setCommentsError(t('forums.errorFetchingComments'));
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId, t]);

  const handleLikePost = async () => {
    if (!post || !currentUser) return;

    try {
      const postRef = doc(db, 'posts', post.id);
      const hasLiked = post.likedBy?.includes(currentUser.uid);
      
      if (hasLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: post.likedBy.filter(id => id !== currentUser.uid)
        });
        
        setPost({
          ...post,
          likes: post.likes - 1,
          likedBy: post.likedBy.filter(id => id !== currentUser.uid)
        });
      } else {
        // Like
        const newLikedBy = [...(post.likedBy || []), currentUser.uid];
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: newLikedBy
        });
        
        setPost({
          ...post,
          likes: post.likes + 1,
          likedBy: newLikedBy
        });
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard/chat');
  };

  const handleNewComment = (newComment: Comment) => {
    setComments([...comments, newComment]);
    
    // Update comment count in post
    if (post) {
      setPost({
        ...post,
        commentCount: post.commentCount + 1
      });
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <p>{t('common.loading')}</p>
      </LoadingContainer>
    );
  }

  if (error || !post) {
    return (
      <ErrorContainer>
        <p>{error || t('forums.postNotFound')}</p>
        <BackButton onClick={handleBackClick}>{t('common.back')}</BackButton>
      </ErrorContainer>
    );
  }

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.uid);

  return (
    <PostDetailsContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <BackButton onClick={handleBackClick}>
        <i className="fas fa-arrow-left"></i> {t('common.back')}
      </BackButton>

      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <PostMeta>
          <UserInfo>
            <UserAvatar src={post.user.photoURL || '/default-avatar.png'} alt={post.user.displayName} />
            <UserName>{post.user.displayName}</UserName>
          </UserInfo>
          <PostDate>
            {new Date(post.createdAt as string).toLocaleDateString()} • {t('forums.views', { count: post.views })}
          </PostDate>
        </PostMeta>
      </PostHeader>

      <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />

      <TagsContainer>
        {post.tags.map(tag => (
          <Tag key={tag}>#{tag}</Tag>
        ))}
      </TagsContainer>

      <ActionsBar>
        <LikeButton onClick={handleLikePost} liked={hasLiked}>
          <i className={hasLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
          {post.likes}
        </LikeButton>
        <CommentsCount>
          <i className="far fa-comment"></i>
          {post.commentCount}
        </CommentsCount>
      </ActionsBar>

      <CommentsSection>
        <CommentsHeader>
          <h3>{t('forums.comments')} ({post.commentCount})</h3>
        </CommentsHeader>

        {commentsLoading ? (
          <p>{t('common.loading')}</p>
        ) : commentsError ? (
          <p>{commentsError}</p>
        ) : (
          <>
            {comments.length === 0 ? (
              <NoComments>{t('forums.noComments')}</NoComments>
            ) : (
              <CommentsList>
                {comments.map(comment => (
                  <CommentItem key={comment.id}>
                    <CommentHeader>
                      <UserAvatar 
                        src={comment.user.photoURL || '/default-avatar.png'} 
                        alt={comment.user.displayName} 
                        small 
                      />
                      <CommentMeta>
                        <UserName>{comment.user.displayName}</UserName>
                        <CommentDate>
                          {new Date(comment.createdAt as string).toLocaleDateString()}
                        </CommentDate>
                      </CommentMeta>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentItem>
                ))}
              </CommentsList>
            )}

            <CommentBox postId={post.id} onCommentAdded={handleNewComment} />
          </>
        )}
      </CommentsSection>
    </PostDetailsContainer>
  );
};

// Styled Components
const PostDetailsContainer = styled.div`
  padding: 1.5rem;
  color: #fff;
  height: 100%;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorContainer = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #ff6b6b;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: white;
  }
  
  i {
    font-size: 0.9rem;
  }
`;

const PostHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.3;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img<{ small?: boolean }>`
  width: ${props => props.small ? '32px' : '40px'};
  height: ${props => props.small ? '32px' : '40px'};
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const PostDate = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const PostContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  a {
    color: #82a1bf;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  code {
    font-family: 'Courier New', monospace;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const LikeButton = styled.button<{ liked: boolean }>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.liked ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.liked ? '#ff6b6b' : 'white'};
  }
  
  i {
    font-size: 1.2rem;
  }
`;

const CommentsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  
  i {
    font-size: 1.2rem;
  }
`;

const CommentsSection = styled.div`
  margin-top: 2rem;
`;

const CommentsHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
  }
`;

const NoComments = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CommentItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const CommentMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const CommentContent = styled.p`
  margin: 0;
  line-height: 1.6;
`;

export default PostDetails;
