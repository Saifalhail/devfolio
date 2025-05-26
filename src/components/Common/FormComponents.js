import styled, { css } from 'styled-components';

/**
 * Shared label component used across forms.
 * Supports RTL text alignment via the isRTL prop.
 */
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
  transition: color 0.3s ease;
  text-align: ${props => (props.isRTL ? 'right' : 'left')};
  font-size: 0.9rem;
`;

const baseInputStyles = css`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  direction: ${props => (props.isRTL ? 'rtl' : 'ltr')};
`;

const lightInput = css`
  border: 2px solid ${props => (props.hasError ? '#c62828' : '#e0e0e0')};
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #cd3efd;
    box-shadow: 0 0 0 3px rgba(205, 62, 253, 0.2);
    background-color: #fff;
  }

  &:focus-visible {
    outline: 2px dashed var(--accent-1);
    outline-offset: 3px;
  }
`;

const darkInput = css`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(205, 62, 253, 0.2);
  color: #fff;

  &:focus {
    outline: none;
    border-color: #cd3efd;
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const variantStyles = {
  light: lightInput,
  dark: darkInput,
};

/**
 * Reusable text input component.
 * @param {'light'|'dark'} [variant='light'] Choose styling variant.
 */
export const FormInput = styled.input`
  ${baseInputStyles}
  ${props => variantStyles[props.variant || 'light']}
`;

/**
 * Reusable select component.
 * Supports the same variants as FormInput.
 */
export const FormSelect = styled.select`
  ${baseInputStyles}
  appearance: none;
  background-image: ${props =>
    props.isRTL
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`};
  background-repeat: no-repeat;
  background-position: ${props => (props.isRTL ? '1rem center' : 'calc(100% - 1rem) center')};
  padding-right: ${props => (props.isRTL ? '1.2rem' : '3rem')};
  padding-left: ${props => (props.isRTL ? '3rem' : '1.2rem')};
  ${props => variantStyles[props.variant || 'light']}
`;

/**
 * Reusable textarea component.
 */
export const FormTextarea = styled.textarea`
  ${baseInputStyles}
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  ${props => variantStyles[props.variant || 'light']}
`;

/**
 * Wrapper for grouping label and input together with focus animation.
 */
export const InputGroup = styled.div`
  margin-bottom: 1.2rem;
  position: relative;
  transition: all 0.3s ease;

  &:focus-within {
    transform: translateY(-5px);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: ${props => (props.isRTL ? 'auto' : '0')};
    right: ${props => (props.isRTL ? '0' : 'auto')};
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #cd3efd, #82a1bf);
    transition: all 0.3s ease;
    opacity: 0;
  }

  &:focus-within:after {
    bottom: 0;
    width: 100%;
    opacity: 1;
  }
`;

export default {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  InputGroup,
};
