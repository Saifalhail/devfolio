import React from 'react';
import styled from 'styled-components';
import { FaDownload, FaComment, FaTimes } from 'react-icons/fa';
import { useMockupUI } from './MockupUIContext';

const MockupModal: React.FC = () => {
  const { selectedMockup, clearSelectedMockup } = useMockupUI();
  
  if (!selectedMockup) return null;
  
  const handleClose = () => {
    clearSelectedMockup();
  };
  
  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <FaTimes />
        </CloseButton>
        
        <ModalHeader>
          <h2>{selectedMockup.title}</h2>
          <ModalActions>
            <ActionButton>
              <FaDownload /> Download
            </ActionButton>
            <ActionButton>
              <FaComment /> Comment
            </ActionButton>
          </ModalActions>
        </ModalHeader>
        
        <MockupImageContainer>
          <MockupImage src={selectedMockup.imageURL} alt={selectedMockup.title} />
        </MockupImageContainer>
        
        <MockupDetails>
          <p>{selectedMockup.description}</p>
          <MockupMeta>
            <span>Created by {selectedMockup.userName}</span>
            <span>Views: {selectedMockup.views}</span>
            <span>Comments: {selectedMockup.commentCount}</span>
          </MockupMeta>
        </MockupDetails>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: #1a1d3a;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(123, 44, 191, 0.5);
    border-radius: 4px;
  }
`;

const CloseButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button.attrs({ className: 'btn-outline-accent' })`
  /* Additional custom styles can be added here if needed */
  border-radius: 6px;
  font-size: 0.9rem;
`;

const MockupImageContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const MockupImage = styled.img`
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const MockupDetails = styled.div`
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  p {
    margin-top: 0;
    line-height: 1.6;
  }
`;

const MockupMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

export default MockupModal;
