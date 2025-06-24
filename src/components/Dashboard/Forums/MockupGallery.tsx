import React from 'react';
import styled, { css } from 'styled-components';
import { FaComment, FaDownload } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { HeaderStyles, SectionTitle } from './ForumStyles';
import { Mockup, MockupComment } from './types';
import { useMockupUI } from './MockupUIContext';

// Dummy data for mockups
const dummyMockups: Mockup[] = [
  {
    id: 'm1',
    title: 'Homepage Design',
    description: 'Initial homepage design with navigation and hero section',
    imageURL: 'https://via.placeholder.com/400x300/232655/ffffff?text=Homepage+Mockup',
    userId: 1,
    userName: 'John Doe',
    createdAt: new Date().toISOString(),
    commentCount: 3,
    views: 12
  },
  {
    id: 'm2',
    title: 'Profile Page',
    description: 'User profile page with portfolio section',
    imageURL: 'https://via.placeholder.com/400x300/232655/ffffff?text=Profile+Mockup',
    userId: 1,
    userName: 'John Doe',
    createdAt: new Date().toISOString(),
    commentCount: 1,
    views: 8
  },
  {
    id: 'm3',
    title: 'Dashboard Layout',
    description: 'Analytics dashboard with responsive widgets and charts',
    imageURL: 'https://via.placeholder.com/400x300/232655/ffffff?text=Dashboard+Mockup',
    userId: 1,
    userName: 'John Doe',
    createdAt: new Date().toISOString(),
    commentCount: 5,
    views: 15
  }
];

interface MockupProps {
  onAddMockup: () => void;
}

const MockupGallery: React.FC<MockupProps> = ({ onAddMockup }) => {
  const { selected, setSelected } = useMockupUI();
  
  return (
    <MockupContainer>
      <SectionHeader>
        <MockupHeader>
          <SectionTitle>Mockups</SectionTitle>
          <AddMockupButton onClick={onAddMockup} aria-label="Add new mockup">
            <FiPlus />
          </AddMockupButton>
        </MockupHeader>
      </SectionHeader>
      
      {/* Floating action button is now in the header */}
      
      <MockupGrid>
        {dummyMockups.map(mockup => (
          <MockupCard key={mockup.id} onClick={() => setSelected(mockup)}>
            <MockupInfo>
              <MockupTitle>{mockup.title}</MockupTitle>
              <MockupDescription>
                {mockup.title === 'Homepage Design' && 'Modern landing page with hero section and feature highlights'}
                {mockup.title === 'Profile Page' && 'User profile with portfolio showcase and stats'}
                {mockup.title === 'Dashboard Layout' && 'Analytics dashboard with responsive widgets and charts'}
              </MockupDescription>
              <MockupMeta>
                <MockupDate>Updated {new Date(mockup.createdAt).toLocaleDateString()}</MockupDate>
                <MockupStats>
                  <MockupStat>
                    <FaComment color="white" /> {mockup.commentCount || 0}
                  </MockupStat>
                </MockupStats>
              </MockupMeta>
            </MockupInfo>
          </MockupCard>
        ))}
      </MockupGrid>
    </MockupContainer>
  );
};

const MockupContainer = styled.div`
  padding: 1rem;
`;

const SectionHeader = styled.div`
  ${HeaderStyles.wrapper}
`;

const MockupHeader = styled.div`
  ${HeaderStyles.header}
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddMockupButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MockupCard = styled.div.attrs({
  className: 'card-glass border-2 border-transparent cursor-pointer border-hover transition'
})`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
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
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const MockupImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const MockupInfo = styled.div`
  padding: 0.75rem;
  color: white;
`;

const MockupTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MockupDescription = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

const MockupMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MockupDate = styled.span`
  font-style: italic;
`;

const MockupStats = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const MockupStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export default MockupGallery;
