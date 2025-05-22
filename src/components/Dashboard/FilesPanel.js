import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaFilter, FaSearch, FaTags, FaDownload, FaEye, FaTrash, FaHistory } from 'react-icons/fa';
import FileCard from './FileCard';
import Button from '../Common/Button';

const FilesPanel = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
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
  
  // Filter files based on category, tags, and search query
  const filteredFiles = mockFiles.filter(file => {
    // Filter by category
    if (selectedCategory !== 'all' && file.category !== selectedCategory) {
      return false;
    }
    
    // Filter by tags
    if (selectedTags.length > 0 && !selectedTags.some(tag => file.tags.includes(tag))) {
      return false;
    }
    
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
  
  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  // Handle tag selection
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Get all unique tags from files
  const allTags = [...new Set(mockFiles.flatMap(file => file.tags))];
  
  return (
    <FilesPanelContainer isRTL={isRTL}>
      <FilesPanelHeader>
        <h2>{t('files.title', 'Files & Deliverables')}</h2>
        <PrimaryButton 
          onClick={() => fileInputRef.current.click()}
        >
          <FaUpload style={{ marginRight: '0.5rem' }} />
          {t('files.upload', 'Upload Files')}
        </PrimaryButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
        />
      </FilesPanelHeader>
      
      <FilesToolbar>
        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder={t('files.search', 'Search files...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <FilterSection>
          <FilterLabel>
            <FaFilter />
            <span>{t('files.filterBy', 'Filter by:')}</span>
          </FilterLabel>
          
          <CategoryFilters>
            <FilterButton 
              active={selectedCategory === 'all'} 
              onClick={() => handleCategoryChange('all')}
            >
              {t('files.categories.all', 'All')}
            </FilterButton>
            <FilterButton 
              active={selectedCategory === 'design'} 
              onClick={() => handleCategoryChange('design')}
            >
              {t('files.categories.design', 'Design')}
            </FilterButton>
            <FilterButton 
              active={selectedCategory === 'docs'} 
              onClick={() => handleCategoryChange('docs')}
            >
              {t('files.categories.docs', 'Docs')}
            </FilterButton>
            <FilterButton 
              active={selectedCategory === 'feedback'} 
              onClick={() => handleCategoryChange('feedback')}
            >
              {t('files.categories.feedback', 'Feedback')}
            </FilterButton>
          </CategoryFilters>
        </FilterSection>
        
        <TagsSection>
          <TagsLabel>
            <FaTags />
            <span>{t('files.tags', 'Tags:')}</span>
          </TagsLabel>
          
          <TagsList>
            {allTags.map(tag => (
              <TagButton
                key={tag}
                active={selectedTags.includes(tag)}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </TagButton>
            ))}
          </TagsList>
        </TagsSection>
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
          {filteredFiles.length > 0 ? (
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

const FilesPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const FilesPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #513a52;
    margin: 0;
    position: relative;
    padding-bottom: 0.5rem;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: #513a52;
      border-radius: 3px;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(90deg, #513a52, #3d2c3d);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(90deg, #3d2c3d, #2a1f2a);
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(81, 58, 82, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(81, 58, 82, 0.2);
  }
`;

const FilesToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.2s ease;
  
  &:focus-within {
    background-color: #f7f9fc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }
  
  svg {
    color: #513a52;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    color: #513a52;
    
    &::placeholder {
      color: #a3a3a3;
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #513a52;
  font-weight: 500;
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
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
  background-color: ${props => props.active ? '#513a52' : '#f7f9fc'};
  color: ${props => props.active ? 'white' : '#513a52'};
  border: none;
  
  &:hover {
    background-color: ${props => props.active ? '#3d2c3d' : '#edf1f7'};
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

const TagsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #513a52;
  font-weight: 500;
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
  background-color: ${props => props.active ? '#513a52' : '#f7f9fc'};
  color: ${props => props.active ? 'white' : '#513a52'};
  border: none;
  
  &:hover {
    background-color: ${props => props.active ? '#3d2c3d' : '#edf1f7'};
  }
`;

const DropZone = styled.div`
  position: relative;
  flex: 1;
  min-height: 300px;
  border: ${props => props.dragActive ? '2px dashed #513a52' : '2px dashed transparent'};
  border-radius: 12px;
  background-color: ${props => props.dragActive ? 'rgba(81, 58, 82, 0.05)' : 'transparent'};
  transition: all 0.3s ease;
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
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  z-index: 10;
  
  svg {
    font-size: 3rem;
    color: #513a52;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    font-weight: 500;
    color: #513a52;
  }
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NoFilesMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / -1;
  padding: 3rem 0;
  
  p {
    font-size: 1.1rem;
    color: #8a8a8a;
    text-align: center;
  }
`;

export default FilesPanel;
