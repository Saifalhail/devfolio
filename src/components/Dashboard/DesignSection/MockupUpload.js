import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { colors, spacing, borderRadius, shadows, transitions, mixins } from '../../../styles/GlobalTheme';

/**
 * MockupUpload - drag and drop upload area for design mockups with preview thumbnails.
 * Reuses GlobalTheme mixins for styling and supports RTL layout.
 */
const MockupUpload = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = files => {
    const mapped = Array.from(files).map(file => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(prev => [...prev, ...mapped]);
  };

  const onInputChange = e => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const onDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removePreview = index => {
    setPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <Container>
      <DropZone
        dragActive={dragActive}
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        aria-label={t('design.uploadMockups')}
      >
        <FaUpload />
        <span>{t('design.uploadPrompt', 'Drag & drop mockups or click to browse')}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={inputRef}
          onChange={onInputChange}
          aria-label={t('design.uploadMockups')}
          style={{ display: 'none' }}
        />
      </DropZone>

      {previews.length > 0 && (
        <PreviewGrid>
          {previews.map((p, idx) => (
            <PreviewItem key={idx} isRTL={isRTL}>
              <img src={p.url} alt={p.file.name} />
              <RemoveButton
                onClick={e => { e.stopPropagation(); removePreview(idx); }}
                title={t('design.remove', 'Remove')}
                aria-label={t('design.remove', 'Remove')}
              >
                <FaTimes />
              </RemoveButton>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const DropZone = styled.div`
  ${mixins.flexCenter};
  flex-direction: column;
  padding: ${spacing.xl};
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: ${borderRadius.lg};
  background: ${colors.background.card};
  color: ${colors.text.secondary};
  cursor: pointer;
  text-align: center;
  transition: ${transitions.medium};

  svg {
    font-size: 2rem;
    margin-bottom: ${spacing.md};
    color: ${colors.accent.primary};
  }

  ${props => props.dragActive && css`
    background: rgba(205, 62, 253, 0.05);
    border-color: ${colors.accent.primary};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${spacing.md};
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: ${borderRadius.md};
  overflow: hidden;
  ${mixins.card(false)}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  ${mixins.flexCenter};
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: ${borderRadius.round};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: ${transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export default MockupUpload;

