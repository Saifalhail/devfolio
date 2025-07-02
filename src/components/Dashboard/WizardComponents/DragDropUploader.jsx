import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaUpload, FaTrashAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaFileAlt } from 'react-icons/fa';
// Import only colors from the theme and define fallback constants for the rest
import { colors } from '../../../styles/GlobalTheme';

// Define fallback constants for styling
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px'
};

const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px'
};

const transitions = {
  default: 'all 0.3s ease'
};

/**
 * DragDropUploader - A drag and drop file upload component
 * 
 * @param {Object} props
 * @param {Array} props.files - Array of file objects
 * @param {function} props.onChange - Function to call when files are added/removed
 * @param {boolean} props.isRTL - Whether the text direction is right-to-left
 * @param {number} props.maxFileSize - Maximum file size in MB
 * @param {Array} props.acceptedFileTypes - Array of accepted file extensions
 */
const DragDropUploader = ({ 
  files = [], 
  onChange, 
  isRTL = false,
  maxFileSize = 20, // 20MB default
  acceptedFileTypes = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'svg', 'zip', 'txt']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return false;
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      setError(`File type .${fileExtension} is not supported`);
      return false;
    }
    
    return true;
  };
  
  const processFiles = (fileList) => {
    setError('');
    const newFiles = Array.from(fileList).filter(validateFile);
    
    if (newFiles.length > 0) {
      // Add metadata to files for display
      const processedFiles = newFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file // Keep the actual file object
      }));
      
      onChange([...files, ...processedFiles]);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  };
  
  const handleRemoveFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onChange(updatedFiles);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf />;
    if (fileType.includes('word') || fileType.includes('docx')) return <FaFileWord />;
    if (fileType.includes('excel') || fileType.includes('xlsx')) return <FaFileExcel />;
    if (fileType.includes('image')) return <FaFileImage />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <FaFileArchive />;
    return <FaFileAlt />;
  };
  
  return (
    <Container isRTL={isRTL}>
      {/* Drag and drop area */}
      <DropZone
        $isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        $isRTL={isRTL}
      >
        <UploadIcon>
          <FaUpload size={24} />
        </UploadIcon>
        <DropzoneText isRTL={isRTL}>
          Drag files here or click to upload
        </DropzoneText>
        <SupportedFormats isRTL={isRTL}>
          Supported formats: {acceptedFileTypes.join(', ')} (Max: {maxFileSize}MB)
        </SupportedFormats>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
        />
      </DropZone>
      
      {/* Error message */}
      {error && <ErrorMessage isRTL={isRTL}>{error}</ErrorMessage>}
      
      {/* File list */}
      {files.length > 0 && (
        <FileList isRTL={isRTL}>
          {files.map((file) => (
            <FileItem key={file.id} isRTL={isRTL}>
              <FileDetails isRTL={isRTL}>
                <FileIcon>{getFileIcon(file.type)}</FileIcon>
                <div>
                  <FileName isRTL={isRTL}>{file.name}</FileName>
                  <FileSize isRTL={isRTL}>{formatFileSize(file.size)}</FileSize>
                </div>
              </FileDetails>
              <RemoveButton 
                onClick={() => handleRemoveFile(file.id)}
                aria-label="Remove file"
                isRTL={isRTL}
              >
                <FaTrashAlt size={14} />
              </RemoveButton>
            </FileItem>
          ))}
        </FileList>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 150px;
  border: 2px dashed ${props => props.$isDragging ? colors.accent.primary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  background-color: ${props => props.$isDragging ? 'rgba(205, 62, 253, 0.05)' : colors.background.secondary};
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.accent.primary};
    background-color: rgba(205, 62, 253, 0.05);
  }
`;

const UploadIcon = styled.div`
  color: ${colors.accent.primary};
  margin-bottom: 8px;
`;

const DropzoneText = styled.div`
  font-size: 1rem;
  color: ${colors.text.primary};
  margin-bottom: 4px;
  text-align: center;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const SupportedFormats = styled.div`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
  text-align: center;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  font-size: 0.85rem;
  margin-top: -4px;
  margin-bottom: 8px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin-bottom: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border-left: 3px solid ${colors.accent.primary};
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const FileIcon = styled.div`
  color: ${colors.accent.primary};
  margin-right: 8px;
  font-size: 1.2rem;
`;

const FileName = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.primary};
  margin-bottom: 2px;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff5252;
  }
  
  &:focus {
    outline: none;
  }
`;

export default DragDropUploader;
