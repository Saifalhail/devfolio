import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaSearch, FaFilter, FaComment, FaEye } from 'react-icons/fa';
import { collection, query, orderBy, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { getAllPosts, Post as ServicePost } from '../../../firebase/services/forums';
import { useAuth } from '../../../contexts/AuthContext';
import NewPostModal from './NewPostModal';
import MockupGallery from './MockupGallery';
import { MockupUIProvider } from './MockupUIContext';
import { DiscussionUIProvider, useDiscussionUI } from './DiscussionUIContext';
import { HeaderStyles, SectionTitle } from './ForumStyles';
import MockupModal from './MockupModal';
import DiscussionModal from './DiscussionModal';
import DiscussionList from './DiscussionList';

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
  const isRTL = i18n.language === 'ar';
  const { setSelectedId } = useDiscussionUI();

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

  // Post click handling is now managed by the DiscussionList component

  return (
    <MockupUIProvider>
      <DiscussionUIProvider>
        <ForumsWrapper>
          <ForumsCard>
            <ForumsTitle>Chat</ForumsTitle>
            <ForumsContent>
              <ForumsLayout>
                <LeftColumn>
                  <SectionHeader>
                    <DiscussionHeader>
                      <SectionTitle>Discussion</SectionTitle>
                      <NewPostButton 
                        onClick={() => setIsNewPostModalOpen(true)}
                        aria-label="Create new post"
                      >
                        <FaPlus /> Post
                      </NewPostButton>
                    </DiscussionHeader>
                    <FilterSection>
                      <SearchBar>
                        <SearchIcon>
                          <FaSearch />
                        </SearchIcon>
                        <SearchInput 
                          type="text" 
                          placeholder="forums.searchPlaceholder" 
                        />
                      </SearchBar>
                      <FilterButton>
                        <FaFilter /> Filter
                      </FilterButton>
                    </FilterSection>
                    <TagsContainer>
                      <TagItem 
                        onClick={() => setActiveTag(null)}
                        $active={activeTag === null}
                      >
                        forums.allTopics
                      </TagItem>
                      {popularTags.map(tag => (
                        <TagItem 
                          key={tag} 
                          onClick={() => setActiveTag(tag)}
                          $active={activeTag === tag}
                        >
                          #{tag}
                        </TagItem>
                      ))}
                    </TagsContainer>
                  </SectionHeader>
                  {loading ? (
                    <LoadingContainer><div>{t('common.loading')}</div></LoadingContainer>
                  ) : error ? (
                    <ErrorContainer><div>{error}</div></ErrorContainer>
                  ) : (
                  <DiscussionList posts={posts} />
                  )}
                </LeftColumn>
                <RightColumn>
                  <MockupGallery onAddMockup={() => {/* Handle adding mockup */}} />
                </RightColumn>
              </ForumsLayout>
            </ForumsContent>
            {isNewPostModalOpen && (
              <NewPostModal
                onClose={() => setIsNewPostModalOpen(false)}
                onSubmit={(newPost) => {
                  // Convert the post to UIPost format
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
                      displayName: newPost.userName || 'Anonymous',
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
                modalTitle="Add New Discussion"
              />
            )}
            <MockupModal />
            <DiscussionModal />
          </ForumsCard>
        </ForumsWrapper>
      </DiscussionUIProvider>
    </MockupUIProvider>
  );
};

const ForumsWrapper = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ForumsCard = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  margin-bottom: 2rem;
`;

const ForumsTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const ForumsContent = styled.div`
  padding: 1rem;
`;

const ForumsLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  height: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;



const SectionHeader = styled.div`
  ${HeaderStyles.wrapper}
`;

const DiscussionHeader = styled.div`
  ${HeaderStyles.header}
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
`;

const NewPostButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(81, 58, 82, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(81, 58, 82, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
  }
`;

const FloatingButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  background: rgba(35, 38, 85, 0.3);
  transition: all 0.2s ease;
  z-index: 100;
  padding: 0;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
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
  background: var(--clr-glass);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 2px solid transparent;
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(123, 44, 191, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(123, 44, 191, 0.5);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PostCardContent = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;

const PostTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
`;

const PostAuthor = styled.div`
font-weight: 500;
color: rgba(255, 255, 255, 0.9);
`;

const PostStats = styled.div`
display: flex;
gap: 1rem;
`;

const PostStat = styled.div`
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
background-color: ${props => props.$liked ? '#faaa93' : 'transparent'};
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

const StatItem = styled.div`
display: flex;
align-items: center;
gap: 0.25rem;
transition: transform 0.2s ease;
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

// Add missing styled components
const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(35, 38, 85, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  flex-grow: 1;
`;

const SearchIcon = styled.div`
  margin-right: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(123, 44, 191, 0.3);
  border: 1px solid rgba(123, 44, 191, 0.5);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(123, 44, 191, 0.5);
    border-color: rgba(123, 44, 191, 0.8);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.5rem 0 1.5rem;
`;

const TagItem = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(123, 44, 191, 0.5)' : 'rgba(35, 38, 85, 0.2)'};
  border: 1px solid ${props => props.$active ? 'rgba(123, 44, 191, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 20px;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$active ? 'rgba(123, 44, 191, 0.6)' : 'rgba(35, 38, 85, 0.3)'};
    transform: translateY(-1px);
  }
`;

const NoPostsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(35, 38, 85, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }
  
  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;



export default ForumsHome;
