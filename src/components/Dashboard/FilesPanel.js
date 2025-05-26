import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { rtl } from '../../utils/rtl';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaFilter, FaSearch, FaTags, FaDownload, FaEye, FaTrash, FaHistory } from 'react-icons/fa';
import FileCard from './FileCard';
import Button from '../Common/Button';
import SkeletonLoader from '../Common/SkeletonLoader';
import {
  Card,
  PanelContainer,
  PanelHeader,
  DashboardTitle,
  Input,
  IconButton,
  PrimaryButton,
  FlexContainer,
  Badge
} from '../../styles/dashboardStyles';
import { colors } from '../../styles/GlobalTheme';

const FilesPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for files
  const mockFiles = [
    {
      id: '1',
      name: 'homepage-design.png',
      type: 'image/png',
      size: 1024000,
      category: 'design',
      tags: ['design', 'homepage', 'final'],
      uploadDate: new Date(2025, 4, 15),
      uploadedBy: 'John Doe',
      isFinal: true,
      thumbnailUrl: 'https://via.placeholder.com/150',
      versions: [
        { id: '1.1', date: new Date(2025, 4, 10), size: 980000 },
        { id: '1.2', date: new Date(2025, 4, 15), size: 1024000 }
      ]
    },
    {
      id: '2',
      name: 'project-requirements.pdf',
      type: 'application/pdf',
      size: 512000,
      category: 'docs',
      tags: ['docs', 'requirements'],
      uploadDate: new Date(2025, 4, 10),
      uploadedBy: 'Jane Smith',
      isFinal: false,
      thumbnailUrl: 'https://via.placeholder.com/150',
      versions: [
        { id: '2.1', date: new Date(2025, 4, 10), size: 512000 }
      ]
    },
    {
      id: '3',
      name: 'logo-concept.svg',
      type: 'image/svg+xml',
      size: 256000,
      category: 'design',
      tags: ['design', 'logo', 'draft'],
      uploadDate: new Date(2025, 4, 5),
      uploadedBy: 'John Doe',
      isFinal: false,
      thumbnailUrl: 'https://via.placeholder.com/150',
      versions: [
        { id: '3.1', date: new Date(2025, 4, 2), size: 240000 },
        { id: '3.2', date: new Date(2025, 4, 5), size: 256000 }
      ]
    },
    {
      id: '4',
      name: 'client-feedback.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 384000,
      category: 'feedback',
      tags: ['feedback', 'client'],
      uploadDate: new Date(2025, 4, 18),
      uploadedBy: 'Jane Smith',
      isFinal: true,
      thumbnailUrl: 'https://via.placeholder.com/150',
      versions: [
        { id: '4.1', date: new Date(2025, 4, 18), size: 384000 }
      ]
    }
  ];
  
  // Filter files based on search query only
  const filteredFiles = mockFiles.filter(file => {
    // Filter by search query
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    // Handle file upload logic here
    console.log('Files selected:', e.target.files);
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };
  
  // No category or tag functions needed
  
  // No dropdown useEffect needed anymore

  return (
    <FilesPanelContainer isRTL={isRTL}>
      <FilesPanelHeader>
        <PanelTitle>{t('files.title', 'Files & Deliverables')}</PanelTitle>
        <UploadButton 
          onClick={() => fileInputRef.current.click()}
        >
          <FaUpload />
          <span>{t('files.upload', 'Upload Files')}</span>
        </UploadButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
        />
      </FilesPanelHeader>
      
      <FilesToolbar>
        <SearchBar isRTL={isRTL}>
          <FaSearch />
          <input
            type="text"
            placeholder={t('files.search', 'Search files...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <ToolbarActions>
          <UploadInfoText>
            {t('files.uploadInfo', 'Drag and drop files anywhere to upload')}
          </UploadInfoText>
        </ToolbarActions>
      </FilesToolbar>
      
      {/* Drag and Drop Upload Area */}
      <DropZone
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        dragActive={dragActive}
      >
        {dragActive && (
          <DropMessage>
            <FaUpload />
            <p>{t('files.dropHere', 'Drop files here')}</p>
          </DropMessage>
        )}
        
        {/* Files Grid */}
        <FilesGrid>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <FileSkeleton key={idx}>
                <SkeletonLoader height="140px" />
                <SkeletonInfo>
                  <SkeletonLoader width="70%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                  <SkeletonLoader width="40%" height="0.8rem" />
                </SkeletonInfo>
              </FileSkeleton>
            ))
          ) : filteredFiles.length > 0 ? (
            filteredFiles.map(file => (
              <FileCard key={file.id} file={file} />
            ))
          ) : (
            <NoFilesMessage>
              <p>{t('files.noFiles', 'No files found matching your criteria')}</p>
            </NoFilesMessage>
          )}
        </FilesGrid>
      </DropZone>
    </FilesPanelContainer>
  );
};

// Using the shared PanelContainer component
const FilesPanelContainer = styled(Card)`
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

// Using the shared PanelHeader component
const FilesPanelHeader = styled(PanelHeader)`
  padding: 1.75rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: ${colors.gradients.card};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// Using the shared DashboardTitle component
const PanelTitle = styled(DashboardTitle)`
  color: #fff;
`;

// Using the shared PrimaryButton component
const UploadButton = styled(PrimaryButton)`
  background-color: #4A6FA5;
  box-shadow: 0 2px 8px rgba(74, 111, 165, 0.2);

  svg {
    margin-right: 0.5rem;
    font-size: 1.1rem;
    ${rtl`
      margin-right: 0;
      margin-left: 0.5rem;
    `}
  }
  
  &:hover {
    background-color: #3d5d8a;
    box-shadow: 0 4px 12px rgba(74, 111, 165, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;

    svg {
      margin-right: 0;
      margin-left: 0.75rem;
      ${rtl`
        margin-right: 0.75rem;
        margin-left: 0;
      `}
    }
  }
`;


const FilesToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: ${colors.gradients.card};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  width: 100%;
  max-width: 350px;
  transition: all 0.2s ease;
  
  svg {
    color: #aaa;
    margin-right: 0.75rem;
    font-size: 0.9rem;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 0.95rem;
    color: #333;
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  &:focus-within {
    border-color: #4A6FA5;
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.1);
    
    svg {
      color: #4A6FA5;
    }
  }
  
  ${props => props.isRTL && css`
    svg {
      margin-right: 0;
      margin-left: 0.75rem;
    }
  `}
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const UploadInfoText = styled.div`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  &:before {
    content: '💡';
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.active ? colors.accent.secondary : colors.background.card};
  color: ${colors.text.primary};
  border: none;
  
  &:hover {
    background: ${props => props.active ? colors.accent.primary : colors.background.hover};
  }
`;

const TagsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? colors.accent.primary : colors.text.secondary};
  background: ${colors.background.card};
  
  &:hover {
    background: ${colors.background.hover};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const TagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.active ? colors.accent.secondary : colors.background.card};
  color: ${colors.text.primary};
  border: none;
  
  &:hover {
    background: ${props => props.active ? colors.accent.primary : colors.background.hover};
  }
`;

const DropZone = styled.div`
  position: relative;
  flex: 1;
  border: ${props => props.dragActive ? '2px dashed #4A6FA5' : '2px dashed transparent'};
  border-radius: 12px;
  transition: all 0.3s ease;
  padding: 2rem;
  background-color: ${props => props.dragActive ? 'rgba(74, 111, 165, 0.05)' : 'transparent'} !important;
  background-image: none !important;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.dragActive ? 'radial-gradient(circle at center, rgba(74, 111, 165, 0.08) 0%, rgba(74, 111, 165, 0) 70%)' : 'none'} !important;
    pointer-events: none;
    z-index: 0;
    border-radius: 12px;
    opacity: ${props => props.dragActive ? 1 : 0};
    transition: opacity 0.5s ease;
  }
`;

const DropMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
  border-radius: 12px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(74, 111, 165, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(74, 111, 165, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 111, 165, 0); }
  }
  
  svg {
    font-size: 3.5rem;
    color: #4A6FA5;
    margin-bottom: 1.5rem;
    animation: bounce 1.5s infinite;
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-15px); }
      60% { transform: translateY(-7px); }
    }
  }
  
  p {
    font-size: 1.5rem;
    color: #333;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
  background: none !important;

  /* Add staggered animation for file cards */
  & > div {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
  }
  
  & > div:nth-child(1) { animation-delay: 0.1s; }
  & > div:nth-child(2) { animation-delay: 0.2s; }
  & > div:nth-child(3) { animation-delay: 0.3s; }
  & > div:nth-child(4) { animation-delay: 0.4s; }
  & > div:nth-child(5) { animation-delay: 0.5s; }
  & > div:nth-child(6) { animation-delay: 0.6s; }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const NoFilesMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: ${colors.background.card};
  border-radius: 12px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  grid-column: 1 / -1;
  
  p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const FileSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export default FilesPanel;
