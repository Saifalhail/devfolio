import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { firestore } from '../../../firebase/config';
import { useAuth } from '../../../contexts/AuthContext';
import MockupGallery from './MockupGallery';
import { MockupUIProvider, useMockupUI } from './MockupUIContext';
import { DiscussionUIProvider } from './DiscussionUIContext';
import { HeaderStyles, SectionTitle } from './ForumStyles';
import MockupModal from './MockupModal';
import DiscussionList from './DiscussionList';

// Default project ID for discussions
const DEFAULT_PROJECT_ID = 'default';



// Inner component that consumes the MockupUIContext
const ForumsContentComponent = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { selectedMockup, openAddModal } = useMockupUI();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isRTL = i18n.language === 'ar';


  return (
    <ForumsWrapper>
      <ForumsCard>
        <ForumsContentWrapper $isRTL={isRTL}>
          <ForumsLayout>
            <LeftColumn>
              <SectionHeader>
                <DiscussionHeader $isRTL={isRTL}>
                  <SectionTitle $isRTL={isRTL}>{t('forums.realTimeChat')}</SectionTitle>
                </DiscussionHeader>
                <SearchSection>
                  <SearchBar $isRTL={isRTL}>
                    <SearchIcon $isRTL={isRTL}>
                      <FaSearch />
                    </SearchIcon>
                    <SearchInput 
                      type="text" 
                      placeholder={t('forums.searchMessages')} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      $isRTL={isRTL}
                    />
                  </SearchBar>
                </SearchSection>
              </SectionHeader>
              
              {/* Chat messages list with integrated reply functionality */}
              <DiscussionList projectId={DEFAULT_PROJECT_ID} searchQuery={searchQuery} />
            </LeftColumn>
            <RightColumn>
              <MockupGallery onAddMockup={openAddModal} />
            </RightColumn>
          </ForumsLayout>
        </ForumsContentWrapper>
        
        {/* Conditionally render the mockup detail modal */}
        {selectedMockup && <MockupModal projectId={DEFAULT_PROJECT_ID} />}
      </ForumsCard>
    </ForumsWrapper>
  );
};

// Main component that provides the context
const ForumsHome = () => {
  return (
    <MockupUIProvider>
      <DiscussionUIProvider>
        <ForumsContentComponent />
      </DiscussionUIProvider>
    </MockupUIProvider>
  );
};

const ForumsWrapper = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ForumsCard = styled.div`
  background: rgba(35, 38, 85, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
`;


const ForumsContentWrapper = styled.div<{ $isRTL?: boolean }>`
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ForumsLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  height: 100%;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  min-height: 600px;
  max-height: 800px;
  
  @media (max-width: 992px) {
    order: 2;
    height: calc(100vh - 200px);
    min-height: 400px;
    max-height: 600px;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 300px;
    max-height: 500px;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  min-height: 600px;
  max-height: 800px;
  overflow: hidden;
  
  @media (max-width: 992px) {
    order: 1;
    height: auto;
    min-height: 300px;
    max-height: 400px;
  }
  
  @media (max-width: 768px) {
    min-height: 250px;
    max-height: 350px;
  }
`;



const SectionHeader = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const DiscussionHeader = styled.div<{ $isRTL?: boolean }>`
  ${HeaderStyles.header}
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0 0.25rem;
  }
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

// Search section styled component
const SearchSection = styled.div`
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const SearchBar = styled.div<{ $isRTL?: boolean }>`
  display: flex;
  align-items: center;
  background: rgba(35, 38, 85, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  flex-grow: 1;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
  }
`;

const SearchIcon = styled.div<{ $isRTL?: boolean }>`
  margin-right: ${props => props.$isRTL ? '0' : '0.5rem'};
  margin-left: ${props => props.$isRTL ? '0.5rem' : '0'};
  color: rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    margin-right: ${props => props.$isRTL ? '0' : '0.4rem'};
    margin-left: ${props => props.$isRTL ? '0.4rem' : '0'};
  }
`;

const SearchInput = styled.input<{ $isRTL?: boolean }>`
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  outline: none;
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
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
