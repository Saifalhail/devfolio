import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Card as BaseCard } from '../../styles/dashboardStyles';
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
import IconButton from '../Common/IconButton';

const FileCard = ({ file }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <FileTitle parentHover={isHovered}>{file.name}</FileTitle>
        {file.isFinal !== undefined && (
          <StatusBadge color={file.isFinal ? '#4CAF50' : '#FFC107'}>
            {file.isFinal ? 
              <><FaCheck /> {t('files.status.final', 'Final')}</> : 
              <><FaClock /> {t('files.status.draft', 'Draft')}</>}
          </StatusBadge>
        )}
      </CardHeader>
      
      <FilePreview onClick={() => setShowPreview(true)}>
        {file.type.startsWith('image/') ? (
          <PreviewImage src={file.thumbnailUrl} alt={file.name} />
        ) : (
          <IconWrapper category={file.type ? file.type.split('/')[0] : 'file'}>
            {getFileIcon()}
          </IconWrapper>
        )}
      </FilePreview>
      
      <CardFooter>
        <FooterInfo>
          <FooterItem>
            <FaCalendarAlt />
            <span>{formatDate(file.uploadDate)}</span>
          </FooterItem>
          
          <FooterItem>
            <FaFile />
            <span>{formatFileSize(file.size)}</span>
          </FooterItem>
        </FooterInfo>
        
        <CardActions>
          <IconButton 
            title={t('files.preview', 'Preview')} 
            icon={<FaEye />} 
            color="#82a1bf"
            onClick={() => setShowPreview(true)}
          />
          <IconButton 
            title={t('files.download', 'Download')} 
            icon={<FaDownload />} 
            color="#faaa93"
          />
          <IconButton 
            title={t('files.delete', 'Delete')} 
            icon={<FaTrash />} 
            color="#e74c3c"
          />
        </CardActions>
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
const Card = styled(BaseCard)`
  cursor: pointer;
  position: relative;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  display: flex;
  flex-direction: column;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &:hover {
    transform: translateY(-5px);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #6e57e0, #9b6dff);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
  height: 100%;
  transform-origin: center;
  border-top: 4px solid ${props => {
    switch(props.category) {
      case 'design': return '#82a1bf';
      case 'docs': return '#27ae60';
      case 'feedback': return '#faaa93';
      default: return '#82a1bf';
    }
  }};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%, rgba(${props => {
      switch(props.category) {
        case 'design': return '130, 161, 191';
        case 'docs': return '39, 174, 96';
        case 'feedback': return '250, 170, 147';
        default: return '130, 161, 191';
      }
    }}, 0.03) 100%);
    z-index: 0;
    pointer-events: none;
  }
  
  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px) scale(1.02);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(130, 161, 191, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(130, 161, 191, 0); }
    100% { box-shadow: 0 0 0 0 rgba(130, 161, 191, 0); }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 0.75rem;
  position: relative;
  z-index: 1;
`;
const FileTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => {
      switch(props.category) {
        case 'design': return '#82a1bf';
        case 'docs': return '#27ae60';
        case 'feedback': return '#faaa93';
        default: return '#82a1bf';
      }
    }};
    transition: width 0.3s ease;
  }
  
  ${props => props.isRTL && `
    &:after {
      left: auto;
      right: 0;
    }
  `}
  
  ${props => props.parentHover && `
    &:after {
      width: 40px;
    }
  `}
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    gap: 1rem;
  }
`;

const FilePreview = styled.div`
  height: 160px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: #f9f9f9;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.1) 100%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    &:before {
      opacity: 1;
    }
  }
  
  img {
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  ${FilePreview}:hover & {
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f9f9f9, #f0f0f0);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.6) 50%, 
      rgba(255, 255, 255, 0) 100%);
    top: 0;
    left: -200%;
    transform: skewX(-20deg);
    transition: all 0.7s ease;
    opacity: 0;
  }
  
  &:hover:before {
    left: 200%;
    opacity: 1;
  }
  
  svg {
    font-size: 3.5rem;
    color: ${props => {
      switch(props.category) {
        case 'design': return '#82a1bf';
        case 'docs': return '#27ae60';
        case 'feedback': return '#faaa93';
        default: return '#82a1bf';
      }
    }};
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem 1.5rem;
  background: white;
  position: relative;
  z-index: 1;
`;

const FooterInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  
  svg {
    color: ${props => {
      switch(props.category) {
        case 'design': return '#82a1bf';
        case 'docs': return '#27ae60';
        case 'feedback': return '#faaa93';
        default: return '#82a1bf';
      }
    }};
    font-size: 1rem;
    opacity: 0.8;
  }
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