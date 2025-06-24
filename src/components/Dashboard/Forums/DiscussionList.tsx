import React from 'react';
import styled from 'styled-components';
import { FaComment, FaEye } from 'react-icons/fa';
import { useDiscussionUI } from './DiscussionUIContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';

// Import the UIPost type from ForumsHome or create a shared types file
import { Post as ServicePost } from '../../../firebase/services/forums';

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

interface DiscussionListProps {
  posts: UIPost[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ posts }) => {
  const { setSelectedId } = useDiscussionUI();

  const handlePostClick = (postId: string) => {
    // Set the selected post ID to open the modal
    setSelectedId(postId);
    
    // Update view count in the background
    const updateViewCount = async () => {
      try {
        const postRef = doc(firestore, 'forumsPosts', postId);
        await updateDoc(postRef, {
          views: increment(1)
        });
      } catch (err) {
        console.error('Error updating view count:', err);
      }
    };
    
    updateViewCount();
  };

  return (
    <DiscussionListContainer>
      {posts.length === 0 ? (
        <NoPostsMessage>No discussions found.</NoPostsMessage>
      ) : (
        posts.map(post => (
          <MockupCard key={post.id} onClick={() => handlePostClick(post.id)}>
            <MockupInfo>
              <MockupTitle>{post.title}</MockupTitle>
              <MockupDescription>
                {post.body ? post.body.substring(0, 120) + (post.body.length > 120 ? '...' : '') : ''}
              </MockupDescription>
              <MockupMeta>
                <MockupDate>
                  Updated {post.createdAt && typeof post.createdAt === 'object' && 'toDate' in post.createdAt 
                    ? post.createdAt.toDate().toLocaleDateString() 
                    : new Date(post.createdAt as any).toLocaleDateString()}
                </MockupDate>
                <MockupStats>
                  <MockupStat>
                    <FaComment color="white" /> {post.commentCount || 0}
                  </MockupStat>
                  <MockupStat>
                    <FaEye color="white" /> {post.views || 0}
                  </MockupStat>
                </MockupStats>
              </MockupMeta>
              {post.tags && post.tags.length > 0 && (
                <TagsList>
                  {post.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>#{tag}</Tag>
                  ))}
                </TagsList>
              )}
            </MockupInfo>
          </MockupCard>
        ))
      )}
    </DiscussionListContainer>
  );
};

const DiscussionListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

// MockupGallery-style components
const MockupCard = styled.article`
  background: rgba(35, 38, 85, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(123, 44, 191, 0.5);
  }
`;

const MockupInfo = styled.div`
  padding: 1.25rem;
`;

const MockupTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const MockupDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MockupMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const MockupDate = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MockupStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const MockupStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: auto;
`;

const Tag = styled.span`
  background: rgba(123, 44, 191, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(35, 38, 85, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  grid-column: 1 / -1;
  backdrop-filter: blur(10px);
`;

export default DiscussionList;
