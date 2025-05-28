import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaLayerGroup, FaLink, FaPalette, FaCode, FaTimes } from 'react-icons/fa';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
  mixins,
  zIndex,
} from '../../../styles/GlobalTheme';

/**
 * StylePreferenceForm - Allows clients to select preferred design styles and colors.
 * This component is presented in a modal-like overlay with RTL support.
 * It can be reused anywhere a quick style survey is needed.
 */
const StylePreferenceForm = ({ isOpen, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    style: 'modern',
    color: 'purple',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotesChange = (e) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <Overlay onClick={onClose} data-testid="style-pref-overlay">
      <FormContainer onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header>
          <h3>{t('design.stylePreferences', 'Style Preferences')}</h3>
          <CloseButton onClick={onClose} aria-label={t('close', 'Close')}>
            <FaTimes />
          </CloseButton>
        </Header>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{t('design.overallStyle', 'Overall Style')}</Label>
            <OptionsGrid>
              <Option>
                <input
                  type="radio"
                  id="modern"
                  name="style"
                  value="modern"
                  checked={formData.style === 'modern'}
                  onChange={handleChange}
                />
                <OptionLabel htmlFor="modern">
                  <OptionIcon><FaLayerGroup /></OptionIcon>
                  {t('design.styles.modern', 'Modern')}
                </OptionLabel>
              </Option>
              <Option>
                <input
                  type="radio"
                  id="corporate"
                  name="style"
                  value="corporate"
                  checked={formData.style === 'corporate'}
                  onChange={handleChange}
                />
                <OptionLabel htmlFor="corporate">
                  <OptionIcon><FaLink /></OptionIcon>
                  {t('design.styles.corporate', 'Corporate')}
                </OptionLabel>
              </Option>
              <Option>
                <input
                  type="radio"
                  id="playful"
                  name="style"
                  value="playful"
                  checked={formData.style === 'playful'}
                  onChange={handleChange}
                />
                <OptionLabel htmlFor="playful">
                  <OptionIcon><FaPalette /></OptionIcon>
                  {t('design.styles.playful', 'Playful')}
                </OptionLabel>
              </Option>
              <Option>
                <input
                  type="radio"
                  id="minimal"
                  name="style"
                  value="minimal"
                  checked={formData.style === 'minimal'}
                  onChange={handleChange}
                />
                <OptionLabel htmlFor="minimal">
                  <OptionIcon><FaCode /></OptionIcon>
                  {t('design.styles.minimal', 'Minimal')}
                </OptionLabel>
              </Option>
            </OptionsGrid>
          </FormGroup>

          <FormGroup>
            <Label>{t('design.colorPreferences', 'Color Preferences')}</Label>
            <ColorsGrid>
              <ColorOption>
                <ColorSwatch color="#6e57e0" />
                <input
                  type="radio"
                  id="purple"
                  name="color"
                  value="purple"
                  checked={formData.color === 'purple'}
                  onChange={handleChange}
                />
                <ColorLabel htmlFor="purple">{t('design.colors.purple', 'Purple')}</ColorLabel>
              </ColorOption>
              <ColorOption>
                <ColorSwatch color="#4a6cf7" />
                <input
                  type="radio"
                  id="blue"
                  name="color"
                  value="blue"
                  checked={formData.color === 'blue'}
                  onChange={handleChange}
                />
                <ColorLabel htmlFor="blue">{t('design.colors.blue', 'Blue')}</ColorLabel>
              </ColorOption>
              <ColorOption>
                <ColorSwatch color="#27ae60" />
                <input
                  type="radio"
                  id="green"
                  name="color"
                  value="green"
                  checked={formData.color === 'green'}
                  onChange={handleChange}
                />
                <ColorLabel htmlFor="green">{t('design.colors.green', 'Green')}</ColorLabel>
              </ColorOption>
              <ColorOption>
                <ColorSwatch color="#e74c3c" />
                <input
                  type="radio"
                  id="red"
                  name="color"
                  value="red"
                  checked={formData.color === 'red'}
                  onChange={handleChange}
                />
                <ColorLabel htmlFor="red">{t('design.colors.red', 'Red')}</ColorLabel>
              </ColorOption>
            </ColorsGrid>
          </FormGroup>

          <FormGroup>
            <Label>{t('design.additionalNotes', 'Additional Notes')}</Label>
            <NotesArea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleNotesChange}
              placeholder={t('design.additionalNotesPlaceholder', 'Any specific preferences or requirements...')}
            />
          </FormGroup>

          <SubmitButton type="submit">
            {t('design.submitPreferences', 'Submit Preferences')}
          </SubmitButton>
        </Form>
      </FormContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
`;

const FormContainer = styled.div`
  background: ${colors.gradients.card};
  color: ${colors.text.primary};
  border-radius: ${borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${shadows.lg};
  direction: ${props => props.dir};
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    font-size: ${spacing.lg};
    font-weight: 600;
    color: ${colors.text.primary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${colors.text.secondary};
  transition: ${transitions.fast};

  &:hover {
    color: ${colors.text.primary};
  }
`;

const Form = styled.form`
  padding: ${spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${spacing.sm};
  font-weight: 500;
  color: ${colors.text.primary};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const Option = styled.div`
  position: relative;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + label {
      background: rgba(205, 62, 253, 0.15);
      border-color: ${colors.accent.primary};
      color: ${colors.accent.primary};

      svg {
        color: ${colors.accent.primary};
      }
    }
  }
`;

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: ${transitions.fast};

  &:hover {
    background: ${colors.background.hover};
    transform: translateY(-2px);
  }
`;

const OptionIcon = styled.div`
  font-size: 1.5rem;
  color: ${colors.text.secondary};
`;

const ColorsGrid = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex-wrap: wrap;
`;

const ColorOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  position: relative;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + label {
      font-weight: 500;
      color: ${colors.accent.primary};
    }
  }
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: ${shadows.sm};
`;

const ColorLabel = styled.label`
  cursor: pointer;
  color: ${colors.text.secondary};
`;

const NotesArea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  background: ${colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.md};
  color: ${colors.text.primary};
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.accent.primary};
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: ${spacing.md};
  ${mixins.gradientButton};
  font-size: 1rem;
  font-weight: 500;
`;

export default StylePreferenceForm;
