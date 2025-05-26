import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useThemeContext } from '../../contexts/ThemeContext';

const SwitchButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-2);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(130, 161, 191, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: var(--accent-1);
    box-shadow: 0 4px 16px rgba(250, 170, 147, 0.15);
  }
`;

const ThemeSwitch = ({ className }) => {
  const { mode, toggleTheme } = useThemeContext();
  const Icon = mode === 'light' ? FaMoon : FaSun;
  const title = mode === 'light' ? 'Dark Mode' : 'Light Mode';

  return (
    <SwitchButton onClick={toggleTheme} className={className} title={title}>
      <Icon />
    </SwitchButton>
  );
};

export default ThemeSwitch;
