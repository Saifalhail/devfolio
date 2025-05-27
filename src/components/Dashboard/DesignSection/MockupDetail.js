import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCheck, FaPen, FaUndo } from 'react-icons/fa';

/**
 * Detailed view for a single design mockup.
 * This component can be reused wherever a mockup preview with annotation
 * and approval workflow is required.
 */
const MockupDetail = ({ mockup, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [annotations, setAnnotations] = useState([]);
  const [currentNote, setCurrentNote] = useState('');

  if (!mockup) return null;

  // Placeholder add annotation handler
  const addAnnotation = () => {
    if (!currentNote.trim()) return;
    setAnnotations([...annotations, { text: currentNote }]);
    setCurrentNote('');
  };

  return (
    <Overlay onClick={onClose}>
      <Content isRTL={isRTL} onClick={e => e.stopPropagation()}>
        <Header>
          <h2>{mockup.title}</h2>
          <CloseButton aria-label={t('common.close', 'Close')} onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>
        <Body>
          <PreviewArea>
            <img src={mockup.imageUrl} alt={mockup.title} />
            {annotations.map((note, index) => (
              <Annotation key={index}>{note.text}</Annotation>
            ))}
          </PreviewArea>
          <Sidebar>
            <Section>
              <SectionTitle>
                <FaPen /> {t('design.annotations', 'Annotations')}
              </SectionTitle>
              <AnnotationList>
                {annotations.map((note, index) => (
                  <li key={index}>{note.text}</li>
                ))}
              </AnnotationList>
              <AnnotationInput
                value={currentNote}
                onChange={e => setCurrentNote(e.target.value)}
                placeholder={t('design.addNote', 'Add a note')}
              />
              <AddButton onClick={addAnnotation}>
                {t('design.add', 'Add')}
              </AddButton>
            </Section>
            <Section>
              <SectionTitle>
                {t('design.versionHistory', 'Version History')}
              </SectionTitle>
              <VersionList>
                {mockup.versions.map((ver, index) => (
                  <VersionItem key={index}>
                    <span>{ver.label}</span>
                    <span>{new Date(ver.date).toLocaleDateString()}</span>
                  </VersionItem>
                ))}
              </VersionList>
            </Section>
            <Section>
              <SectionTitle>
                {t('design.approval', 'Approval')}
              </SectionTitle>
              <ButtonRow>
                <ApproveButton>
                  <FaCheck /> {t('design.approve', 'Approve')}
                </ApproveButton>
                <RejectButton>
                  <FaUndo /> {t('design.requestChanges', 'Request Changes')}
                </RejectButton>
              </ButtonRow>
            </Section>
          </Sidebar>
        </Body>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Content = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 1100px;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  direction: ${props => (props.isRTL ? 'rtl' : 'ltr')};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #513a52;
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #513a52;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #e74c3c;
    transform: rotate(90deg);
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const PreviewArea = styled.div`
  flex: 2;
  position: relative;
  background: #f7f9fc;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const Annotation = styled.div`
  position: absolute;
  top: 10%;
  left: 10%;
  padding: 0.3rem 0.6rem;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const Sidebar = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #fafafa;
  border-left: 1px solid #eee;
  padding: 1rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #513a52;
`;

const AnnotationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem;
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.9rem;
  color: #333;
`;

const AnnotationInput = styled.textarea`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.9rem;
  resize: vertical;
`;

const AddButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #6e57e0, #9b6dff);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const VersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const VersionItem = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f7f9fc;
  padding: 0.5rem;
  border-radius: 6px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ApproveButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const RejectButton = styled(ApproveButton)`
  background: #e74c3c;
`;

export default MockupDetail;
