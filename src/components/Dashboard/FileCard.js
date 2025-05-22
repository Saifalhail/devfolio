import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileCode, 
  FaFileAudio, FaFileVideo, FaDownload, FaEye, FaTrash, 
  FaHistory, FaTag, FaCheck, FaClock
} from 'react-icons/fa';
import FilePreviewModal from './FilePreviewModal';
import Button from '../Common/Button';

const FileCard = ({ file }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showPreview, setShowPreview] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get file icon based on file type
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return <FaFileImage />;
    else if (file.type === 'application/pdf') return <FaFilePdf />;
    else if (file.type.includes('word')) return <FaFileWord />;
    else if (file.type.includes('audio')) return <FaFileAudio />;
    else if (file.type.includes('video')) return <FaFileVideo />;
    else if (file.type.includes('text') || file.type.includes('code')) return <FaFileCode />;
    else return <FaFile />;
  };
  
  // Get file thumbnail or preview
  const getThumbnail = () => {
    if (file.type.startsWith('image/')) {
      return (
        <ImageThumbnail>
          <img src={file.thumbnailUrl} alt={file.name} />
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </ImageThumbnail>
      );
    } else {
      return (
        <IconThumbnail>
          {getFileIcon()}
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </IconThumbnail>
      );
    }
  };
  
  return (
    <>
      <FileCardContainer isRTL={isRTL}>
        {/* File Preview/Thumbnail */}
        <ThumbnailContainer onClick={() => setShowPreview(true)}>
          {getThumbnail()}
        </ThumbnailContainer>
        
        {/* File Info */}
        <FileInfo>
          <FileName>{file.name}</FileName>
          <FileDetails>
            <FileSize>{formatFileSize(file.size)}</FileSize>
            <FileDate>
              <FaClock />
              <span>{formatDate(file.uploadDate)}</span>
            </FileDate>
          </FileDetails>
          
          {/* File Tags */}
          <TagsContainer>
            {file.tags.map((tag, index) => (
              <Tag key={index} category={file.category}>
                <FaTag />
                <span>{tag}</span>
              </Tag>
            ))}
          </TagsContainer>
          
          {/* Status Indicator */}
          <StatusIndicator isFinal={file.isFinal}>
            {file.isFinal ? (
              <>
                <FaCheck />
                <span>{t('files.status.final', 'Final')}</span>
              </>
            ) : (
              <>
                <FaClock />
                <span>{t('files.status.draft', 'Draft')}</span>
              </>
            )}
          </StatusIndicator>
        </FileInfo>
        
        {/* File Actions */}
        <FileActions>
          <ActionIcon 
            title={t('files.actions.preview', 'Preview')} 
            onClick={() => setShowPreview(true)}
            aria-label={t('files.actions.preview', 'Preview')}
          >
            <FaEye />
          </ActionIcon>
          <ActionIcon 
            title={t('files.actions.download', 'Download')}
            aria-label={t('files.actions.download', 'Download')}
          >
            <FaDownload />
          </ActionIcon>
          <ActionIcon 
            title={t('files.actions.versions', 'Version History')} 
            onClick={() => setShowVersions(!showVersions)}
            active={showVersions}
            aria-label={t('files.actions.versions', 'Version History')}
          >
            <FaHistory />
          </ActionIcon>
          <ActionIcon 
            title={t('files.actions.delete', 'Delete')} 
            danger
            aria-label={t('files.actions.delete', 'Delete')}
          >
            <FaTrash />
          </ActionIcon>
        </FileActions>
        
        {/* Version History (Expandable) */}
        {showVersions && (
          <VersionHistory>
            <VersionHistoryTitle>{t('files.versionHistory', 'Version History')}</VersionHistoryTitle>
            {file.versions.map((version, index) => (
              <VersionItem key={index} isCurrent={index === file.versions.length - 1}>
                <VersionInfo>
                  <VersionNumber>
                    {t('files.version', 'Version')} {file.versions.length - index}
                  </VersionNumber>
                  <VersionDate>{formatDate(version.date)}</VersionDate>
                  <VersionSize>{formatFileSize(version.size)}</VersionSize>
                </VersionInfo>
                <VersionActions>
                  <ActionIcon 
                    title={t('files.actions.download', 'Download')}
                    aria-label={t('files.actions.download', 'Download')}
                  >
                    <FaDownload />
                  </ActionIcon>
                </VersionActions>
              </VersionItem>
            ))}
          </VersionHistory>
        )}
      </FileCardContainer>
      
      {/* File Preview Modal */}
      {showPreview && (
        <FilePreviewModal 
          file={file} 
          isOpen={showPreview} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </>
  );
};

const FileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid #f5f5f5;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  cursor: pointer;
`;

const ImageThumbnail = styled.div`
  height: 100%;
  width: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IconThumbnail = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fc;
  
  svg {
    font-size: 3rem;
    color: #82a1bf;
  }
`;

const Watermark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: rgba(81, 58, 82, 0.7);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  transform: rotate(-30deg);
  pointer-events: none;
`;

const FileInfo = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const FileName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #513a52;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const FileSize = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const FileDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #666;
  
  svg {
    font-size: 0.7rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.category) {
      case 'design': return 'rgba(130, 161, 191, 0.15)';
      case 'docs': return 'rgba(250, 170, 147, 0.15)';
      case 'feedback': return 'rgba(81, 58, 82, 0.15)';
      default: return 'rgba(130, 161, 191, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case 'design': return '#6889a8';
      case 'docs': return '#f89883';
      case 'feedback': return '#513a52';
      default: return '#6889a8';
    }
  }};
  
  svg {
    font-size: 0.6rem;
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background-color: ${props => props.isFinal ? 'rgba(39, 174, 96, 0.15)' : 'rgba(242, 201, 76, 0.15)'};
  color: ${props => props.isFinal ? '#27ae60' : '#f2c94c'};
  
  svg {
    font-size: 0.7rem;
  }
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
  padding: 0.75rem 1.25rem;
  font-size: 1.35rem;
  border-top: 1px solid #f5f5f5;
  background-color: #fafafa;
`;

const FileCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border-bottom: 1px solid #f5f5f5;
  background-color: #fafafa;
`;

const VersionHistory = styled.div`
  padding: 0.5rem 1rem;
  background-color: #f9f9f9;
  border-top: 1px solid #f5f5f5;
`;

const VersionHistoryTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #513a52;
  margin: 0.75rem 0;
`;

const VersionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f5f5;
`;

const VersionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const VersionNumber = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: #513a52;
`;

const VersionDate = styled.span`
  font-size: 0.7rem;
  color: #666;
`;

const VersionSize = styled.span`
  font-size: 0.7rem;
  color: #666;
`;

const VersionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
`;

const ActionIcon = styled.button`
  all: unset;
  color: ${props => props.danger ? '#e74c3c' : '#513a52'};
  font-size: 1.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.danger ? '#c0392b' : '#3d2c3d'};
    transform: translateY(-1px);
  }
  
  ${props => props.active && css`
    color: #513a52;
    font-weight: bold;
  `}
`;

export default FileCard;
