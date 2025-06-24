import React, { useState } from 'react';
import styled from 'styled-components';
import { FaComment, FaPlus, FaDownload } from 'react-icons/fa';

// Dummy data for mockups
const dummyMockups = [
  {
    id: 'm1',
    title: 'Homepage Design',
    imageUrl: 'https://via.placeholder.com/400x300/232655/ffffff?text=Homepage+Mockup',
    author: 'Saif',
    comments: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 'm2',
    title: 'Profile Page',
    imageUrl: 'https://via.placeholder.com/400x300/232655/ffffff?text=Profile+Mockup',
    author: 'Saif',
    comments: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'm3',
    title: 'Dashboard Layout',
    imageUrl: 'https://via.placeholder.com/400x300/232655/ffffff?text=Dashboard+Mockup',
    author: 'Saif',
    comments: 5,
    createdAt: new Date().toISOString()
  }
];

interface MockupProps {
  onAddMockup: () => void;
}

const MockupGallery: React.FC<MockupProps> = ({ onAddMockup }) => {
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);
  
  return (
    <MockupContainer>
      <MockupHeader>
        <h2>Design Mockups</h2>
        <AddMockupButton onClick={onAddMockup}>
          <FaPlus />
          <span>Add Mockup</span>
        </AddMockupButton>
      </MockupHeader>
      
      <MockupGrid>
        {dummyMockups.map(mockup => (
          <MockupCard key={mockup.id} onClick={() => setSelectedMockup(mockup.id)}>
            <MockupImage src={mockup.imageUrl} alt={mockup.title} />
            <MockupInfo>
              <MockupTitle>{mockup.title}</MockupTitle>
              <MockupMeta>
                <span>By {mockup.author}</span>
                <MockupComments>
                  <FaComment /> {mockup.comments}
                </MockupComments>
              </MockupMeta>
            </MockupInfo>
            <MockupActions>
              <ActionButton>
                <FaComment />
              </ActionButton>
              <ActionButton>
                <FaDownload />
              </ActionButton>
            </MockupActions>
          </MockupCard>
        ))}
      </MockupGrid>
    </MockupContainer>
  );
};

const MockupContainer = styled.div`
  padding: 1rem;
  background: rgba(35, 38, 85, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const MockupHeader = styled.div`
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

const AddMockupButton = styled.button`
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

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MockupCard = styled.div`
  background: rgba(35, 38, 85, 0.4);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    
    img {
      transform: scale(1.05);
    }
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
  font-size: 1rem;
  font-weight: 600;
`;

const MockupMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const MockupComments = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MockupActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(3px);
  
  &:hover {
    background: rgba(123, 44, 191, 0.8);
    transform: scale(1.1);
  }
`;

export default MockupGallery;
