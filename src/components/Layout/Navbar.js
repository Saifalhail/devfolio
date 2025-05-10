import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import { rtl } from '../../utils/rtl';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav scrolled={scrolled}>
      <NavContainer>
        <Logo to="/">
          <LogoText>DevFolio</LogoText>
        </Logo>
        
        <HamburgerButton onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerButton>
        
        <NavMenu $isOpen={isOpen}>
          <NavItem>
            <NavLink to="/">{t('navbar.home')}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/services">{t('navbar.services')}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/portfolio">{t('navbar.portfolio')}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about">{t('navbar.about')}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact">{t('navbar.contact')}</NavLink>
          </NavItem>
          <NavItem>
            <StyledLanguageSwitcher />
          </NavItem>
        </NavMenu>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.nav`
  background-color: ${({ $scrolled }) => $scrolled ? 'rgba(254, 239, 196, 0.95)' : 'var(--primary-bg)'};
  padding: ${({ $scrolled }) => $scrolled ? '0.7rem 0' : '1.2rem 0'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 2.5px solid var(--accent-2);
  box-shadow: ${({ $scrolled }) => $scrolled ? '0 5px 20px rgba(0, 0, 0, 0.08)' : 'none'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  text-decoration: none;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 30%;
    height: 4px;
    background-color: var(--accent-1);
    bottom: 0;
    left: 0;
    border-radius: 4px;
  }
`;

const HamburgerButton = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  
  span {
    height: 3px;
    width: 25px;
    background-color: var(--dark);
    margin-bottom: 4px;
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgba(254, 239, 196, 0.98);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
    padding: 1.5rem 0;
    margin-top: 0.5rem;
    border-radius: 0 0 16px 16px;
    transform: ${({$isOpen}) => $isOpen ? 'scaleY(1)' : 'scaleY(0)'};
    transform-origin: top;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    opacity: ${({$isOpen}) => $isOpen ? '1' : '0'};
    visibility: ${({$isOpen}) => $isOpen ? 'visible' : 'hidden'};
    backdrop-filter: blur(10px);
  }
`;

const NavItem = styled.li`
  margin: 0 0.5rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin: 0.8rem 0;
    text-align: center;
    justify-content: center;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  color: var(--dark);
  font-weight: 500;
  position: relative;
  padding: 0 0.8rem;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    background-color: var(--accent-1);
    bottom: 0;
    left: 0;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--accent-1);
    
    &:after {
      width: 100%;
    }
  }
`;

const StyledLanguageSwitcher = styled(LanguageSwitcher)`
  /* Keep round style from LanguageSwitcher.js */
  box-shadow: 0 2px 8px rgba(130,161,191,0.10);
`;

export default Navbar;
