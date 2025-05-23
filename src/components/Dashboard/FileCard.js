import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileCode, 
  FaFileAudio, FaFileVideo, FaDownload, FaEye, FaTrash, 
  FaHistory, FaCheck, FaClock, FaShare, FaCalendarAlt,
  FaEllipsisV
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import FilePreviewModal from './FilePreviewModal';

const FileCard = ({ file }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Format dates
  const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: isRTL ? ar : enUS
    });
  };
  
  // Get file icon based on type
  const getFileIcon = () => {
    const type = file.type.split('/')[0];
    const extension = file.name.split('.').pop().toLowerCase();
    
    switch(type) {
      case 'image':
        return <FaFileImage />;
      case 'application':
        if (extension === 'pdf') return <FaFilePdf />;
        else if (['doc', 'docx'].includes(extension)) return <FaFileWord />;
        return <FaFile />;
      case 'text':
        return <FaFileCode />;
      case 'audio':
        return <FaFileAudio />;
      case 'video':
        return <FaFileVideo />;
      default:
        return <FaFile />;
    }
  };
  
  return (
    <Card 
      isRTL={isRTL} 
      category={file.category}
    >
      <CardHeader>
        <FileTitle>{file.name}</FileTitle>
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          <FaEllipsisV />
        </MenuButton>
        
        {menuOpen && (
          <MenuDropdown isRTL={isRTL}>
            <MenuItem onClick={() => setShowPreview(true)}>
              <FaEye />
              {t('files.preview', 'Preview')}
            </MenuItem>
            <MenuItem>
              <FaDownload />
              {t('files.download', 'Download')}
            </MenuItem>
            <MenuItem>
              <FaShare />
              {t('files.share', 'Share')}
            </MenuItem>
            <MenuItem>
              <FaHistory />
              {t('files.versions', 'Version History')}
            </MenuItem>
            <MenuDivider />
            <MenuItem isDelete>
              <FaTrash />
              {t('files.delete', 'Delete')}
            </MenuItem>
          </MenuDropdown>
        )}
      </CardHeader>
      
      <FilePreview onClick={() => setShowPreview(true)}>
        {file.type.startsWith('image/') ? (
          <img src={file.thumbnailUrl} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <IconWrapper>
            {getFileIcon()}
          </IconWrapper>
        )}
      </FilePreview>
      
      <CardFooter>
        <FooterItem>
          <FaCalendarAlt />
          <span>{formatDate(file.uploadDate)}</span>
        </FooterItem>
        
        <FooterItem>
          <FaFile />
          <span>{formatFileSize(file.size)}</span>
        </FooterItem>
        
        {file.tags && file.tags.length > 0 && (
          <TagsContainer>
            {file.tags.map(tag => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          </TagsContainer>
        )}
        
        {file.isFinal !== undefined && (
          <StatusBadge color={file.isFinal ? '#4CAF50' : '#FFC107'}>
            {file.isFinal ? 
              <><FaCheck /> {t('files.status.final', 'Final')}</> : 
              <><FaClock /> {t('files.status.draft', 'Draft')}</>}
          </StatusBadge>
        )}
      </CardFooter>
      
      {showPreview && (
        <FilePreviewModal 
          file={file}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Card>
  );
};

// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  border-left: 4px solid ${props => {
    switch(props.category) {
      case 'design': return '#82a1bf';
      case 'docs': return '#27ae60';
      case 'feedback': return '#faaa93';
      default: return '#82a1bf';
    }
  }};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  position: relative;
`;

const FileTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  line-height: 1.4;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
    color: #666;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  ${props => props.isRTL ? 'left: 0;' : 'right: 0;'}
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 180px;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  ${props => props.isDelete && `
    color: #f44336;
  `}
  
  &:hover {
    background: #f5f5f5;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
`;

const FilePreview = styled.div`
  height: 120px;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
`;

const IconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  
  svg {
    font-size: 2.5rem;
    color: #82a1bf;
  }
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  flex-wrap: wrap;
  
  svg {
    color: #82a1bf;
    font-size: 0.9rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const TagBadge = styled.div`
  background: rgba(130, 161, 191, 0.2);
  color: #82a1bf;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusBadge = styled.div`
  background: ${props => `${props.color}20`};
  color: ${props => props.color};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export default FileCard;