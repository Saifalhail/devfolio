import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaTimes, FaDownload, FaHistory, FaTag, 
  FaUser, FaClock, FaFileAlt
} from 'react-icons/fa';

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
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
  
  // Render preview based on file type
  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <ImagePreview>
          <img src={file.thumbnailUrl} alt={file.name} />
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </ImagePreview>
      );
    } else if (file.type === 'application/pdf') {
      return (
        <PDFPreview>
          <iframe 
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.thumbnailUrl)}&embedded=true`} 
            width="100%" 
            height="100%" 
            frameBorder="0"
            title={file.name}
          />
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </PDFPreview>
      );
    } else if (file.type.includes('video')) {
      return (
        <VideoPreview>
          <video controls>
            <source src={file.thumbnailUrl} type={file.type} />
            {t('files.videoNotSupported', 'Your browser does not support the video tag.')}
          </video>
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </VideoPreview>
      );
    } else if (file.type.includes('audio')) {
      return (
        <AudioPreview>
          <audio controls>
            <source src={file.thumbnailUrl} type={file.type} />
            {t('files.audioNotSupported', 'Your browser does not support the audio tag.')}
          </audio>
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </AudioPreview>
      );
    } else {
      // Generic file preview
      return (
        <GenericPreview>
          <FaFileAlt />
          <p>{t('files.previewNotAvailable', 'Preview not available for this file type')}</p>
          <DownloadButton>
            <FaDownload />
            <span>{t('files.download', 'Download to view')}</span>
          </DownloadButton>
          {!file.isFinal && <Watermark>{t('files.draft', 'DRAFT')}</Watermark>}
        </GenericPreview>
      );
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent isRTL={isRTL} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{file.name}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <PreviewContainer>
            {renderPreview()}
          </PreviewContainer>
          
          <FileDetails>
            <DetailSection>
              <DetailTitle>{t('files.details.fileInfo', 'File Information')}</DetailTitle>
              <DetailItem>
                <DetailLabel>{t('files.details.size', 'Size')}:</DetailLabel>
                <DetailValue>{formatFileSize(file.size)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('files.details.type', 'Type')}:</DetailLabel>
                <DetailValue>{file.type}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('files.details.category', 'Category')}:</DetailLabel>
                <DetailValue>{file.category}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('files.details.status', 'Status')}:</DetailLabel>
                <DetailValue>
                  {file.isFinal ? 
                    t('files.status.final', 'Final') : 
                    t('files.status.draft', 'Draft')
                  }
                </DetailValue>
              </DetailItem>
            </DetailSection>
            
            <DetailSection>
              <DetailTitle>{t('files.details.uploadInfo', 'Upload Information')}</DetailTitle>
              <DetailItem>
                <DetailLabel>{t('files.details.uploadedBy', 'Uploaded By')}:</DetailLabel>
                <DetailValue>
                  <UserInfo>
                    <FaUser />
                    <span>{file.uploadedBy}</span>
                  </UserInfo>
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('files.details.uploadDate', 'Upload Date')}:</DetailLabel>
                <DetailValue>
                  <DateInfo>
                    <FaClock />
                    <span>{formatDate(file.uploadDate)}</span>
                  </DateInfo>
                </DetailValue>
              </DetailItem>
            </DetailSection>
            
            <DetailSection>
              <DetailTitle>{t('files.details.tags', 'Tags')}</DetailTitle>
              <TagsContainer>
                {file.tags.map((tag, index) => (
                  <Tag key={index} category={file.category}>
                    <FaTag />
                    <span>{tag}</span>
                  </Tag>
                ))}
              </TagsContainer>
            </DetailSection>
            
            <DetailSection>
              <DetailTitle>{t('files.details.versions', 'Version History')}</DetailTitle>
              <VersionsList>
                {file.versions.map((version, index) => (
                  <VersionItem key={index} isCurrent={index === file.versions.length - 1}>
                    <VersionInfo>
                      <VersionNumber>
                        {t('files.version', 'Version')} {file.versions.length - index}
                        {index === file.versions.length - 1 && 
                          ` (${t('files.current', 'Current')})`
                        }
                      </VersionNumber>
                      <VersionDate>{formatDate(version.date)}</VersionDate>
                      <VersionSize>{formatFileSize(version.size)}</VersionSize>
                    </VersionInfo>
                    <VersionDownload>
                      <FaDownload />
                    </VersionDownload>
                  </VersionItem>
                ))}
              </VersionsList>
            </DetailSection>
          </FileDetails>
        </ModalBody>
        
        <ModalFooter>
          <ModalButton onClick={onClose}>
            {t('files.close', 'Close')}
          </ModalButton>
          <ModalButton primary>
            <FaDownload />
            <span>{t('files.download', 'Download')}</span>
          </ModalButton>
        </ModalFooter>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #513a52;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f7f9fc;
    color: #513a52;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PreviewContainer = styled.div`
  flex: 2;
  overflow: hidden;
  position: relative;
  background-color: #f7f9fc;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ImagePreview = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PDFPreview = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const VideoPreview = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  video {
    max-width: 100%;
    max-height: 100%;
  }
`;

const AudioPreview = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  
  audio {
    width: 100%;
  }
`;

const GenericPreview = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  
  svg {
    font-size: 4rem;
    color: #82a1bf;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #82a1bf;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #6889a8;
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
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(81, 58, 82, 0.5);
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 4px;
  transform: rotate(-30deg);
  pointer-events: none;
`;

const FileDetails = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #fff;
  border-left: 1px solid #eee;
  
  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid #eee;
    padding: 1rem;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #513a52;
  margin: 0 0 0.75rem;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  min-width: 120px;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #82a1bf;
    font-size: 0.8rem;
  }
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #82a1bf;
    font-size: 0.8rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
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
    font-size: 0.7rem;
  }
`;

const VersionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const VersionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background-color: ${props => props.isCurrent ? 'rgba(130, 161, 191, 0.1)' : '#f7f9fc'};
`;

const VersionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const VersionNumber = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #513a52;
`;

const VersionDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const VersionSize = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const VersionDownload = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background-color: #f0f0f0;
  color: #513a52;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
`;

const ModalButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.primary ? '#82a1bf' : '#f7f9fc'};
  color: ${props => props.primary ? 'white' : '#513a52'};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#6889a8' : '#edf1f7'};
  }
`;

export default FilePreviewModal;
