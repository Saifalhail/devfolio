import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import AuthModal from '../Common/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when language changes
  useEffect(() => {
    setIsOpen(false);
  }, [i18n.language]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNavLinkClick = () => {
    setIsOpen(false);
  };
  
  const handleDashboardClick = (e) => {
    e.preventDefault();
    
    if (currentUser) {
      // If user is logged in, navigate to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, show auth modal
      setShowAuthModal(true);
    }
    
    setIsOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Nav $scrolled={isScrolled}>
      {/* Desktop: Logo in corner, Mobile: Logo centered */}
      <NavContainer>
        {/* Desktop view: Menu centered */}
        <DesktopMenu>
          <NavMenu isRTL={isRTL}>
            <NavItem>
              <NavLink to="/" onClick={handleNavLinkClick}>{t('navbar.home')}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/services" onClick={handleNavLinkClick}>{t('navbar.services')}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/portfolio" onClick={handleNavLinkClick}>{t('navbar.portfolio')}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about" onClick={handleNavLinkClick}>{t('navbar.about')}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" onClick={handleNavLinkClick}>{t('navbar.contact')}</NavLink>
            </NavItem>
            <NavItem>
              <LoginButton onClick={handleDashboardClick}>
                {currentUser ? t('navbar.dashboard', 'Dashboard') : t('navbar.login', 'Login')}
              </LoginButton>
            </NavItem>
            <NavItem>
              <StyledLanguageSwitcher />
            </NavItem>
          </NavMenu>
        </DesktopMenu>
        
        {/* Mobile view: Logo centered */}
        <MobileLogoWrapper>
          <Logo to="/">
            <LogoText>
              <span style={{ direction: 'ltr', display: 'inline-block' }} data-component-name="Navbar">
                <LogoHighlight>S.</LogoHighlight>N.P
              </span>
              <LogoAccent />
            </LogoText>
          </Logo>
        </MobileLogoWrapper>
      </NavContainer>
      
      {/* Desktop: Logo in corner */}
      <LogoWrapper isRTL={isRTL}>
        <Logo to="/">
          <LogoText>
            <span style={{ direction: 'ltr', display: 'inline-block' }} data-component-name="Navbar">
              <LogoHighlight>S.</LogoHighlight>N.P
            </span>
            <LogoAccent />
          </LogoText>
        </Logo>
      </LogoWrapper>
      
      {/* Mobile menu button positioned in corner */}
      <HamburgerWrapper isRTL={isRTL}>
        <HamburgerButton onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerButton>
      </HamburgerWrapper>
      
      {/* Mobile Menu - Separate from desktop menu */}
      <MobileMenu $isOpen={isOpen} isRTL={isRTL}>
        <NavItem>
          <NavLink to="/" onClick={handleNavLinkClick}>{t('navbar.home')}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/services" onClick={handleNavLinkClick}>{t('navbar.services')}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/portfolio" onClick={handleNavLinkClick}>{t('navbar.portfolio')}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/about" onClick={handleNavLinkClick}>{t('navbar.about')}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contact" onClick={handleNavLinkClick}>{t('navbar.contact')}</NavLink>
        </NavItem>
        <NavItem>
          {currentUser ? (
            <NavDropdown>
              <LoginButton onClick={handleDashboardClick}>
                {t('navbar.dashboard', 'Dashboard')}
              </LoginButton>
              <DropdownContent>
                <DropdownItem onClick={handleDashboardClick}>
                  {t('navbar.dashboard', 'Dashboard')}
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  {t('navbar.logout', 'Logout')}
                </DropdownItem>
              </DropdownContent>
            </NavDropdown>
          ) : (
            <LoginButton onClick={handleDashboardClick}>
              {t('navbar.login', 'Login')}
            </LoginButton>
          )}
        </NavItem>
        <NavItem>
          <StyledLanguageSwitcher />
        </NavItem>
      </MobileMenu>
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </Nav>
  );
};

// New wrapper components for better positioning
const MobileMenu = styled.ul`
  display: none;
  flex-direction: column;
  list-style-type: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  background: linear-gradient(180deg, rgba(42, 18, 82, 0.9), rgba(18, 20, 44, 0.9));
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(205, 62, 253, 0.05);
  padding: 1.5rem 0;
  margin: 0;
  border-radius: 0 0 20px 20px;
  border-top: 1px solid rgba(205, 62, 253, 0.2);
  width: 100%;
  z-index: 20;
  transform: ${({$isOpen}) => $isOpen ? 'scaleY(1)' : 'scaleY(0)'};
  transform-origin: top;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: ${({$isOpen}) => $isOpen ? '1' : '0'};
  visibility: ${({$isOpen}) => $isOpen ? 'visible' : 'hidden'};
  backdrop-filter: blur(15px);
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileLogoWrapper = styled.div`
  display: none;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 0;
  position: relative;
  top: 5px; /* Move logo higher up vertically */
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;
const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  ${props => props.isRTL ? 'right' : 'left'}: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile as we're using MobileLogoWrapper instead */
  }
`;

const HamburgerWrapper = styled.div`
  position: absolute;
  top: 0;
  ${props => props.isRTL ? 'left' : 'right'}: 0;
  height: 100%;
  display: none;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: flex;
    position: absolute; /* Keep absolute positioning on mobile */
    top: 50%;
    transform: translateY(-50%);
  }
`;

// Animation keyframes for navbar effects

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 15px rgba(0, 212, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.3); }
`;

const shimmerEffect = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

const Nav = styled.nav`
  background: linear-gradient(to right, rgba(18, 20, 44, 0.85), rgba(42, 18, 82, 0.85), rgba(18, 20, 44, 0.85));
  height: ${({ $scrolled }) => $scrolled ? '60px' : '70px'}; /* Fixed height for better alignment */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: ${({ $scrolled }) => $scrolled ? '2px solid #cd3efd' : 'none'}; /* Updated to new purple color */
  box-shadow: ${({ $scrolled }) => $scrolled ? '0 10px 30px rgba(205, 62, 253, 0.2)' : '0 5px 15px rgba(0, 0, 0, 0.1)'}; /* Updated to new purple color */
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center; /* Center items vertically */
  transition: all 0.3s ease;
  
  /* Glowing edge effect */
  &:after {
    content: '';
    position: absolute;
    bottom: ${({ $scrolled }) => $scrolled ? '-2px' : '0'};
    left: 0;
    width: 100%;
    height: ${({ $scrolled }) => $scrolled ? '2px' : '0'};
    background: linear-gradient(90deg, 
      transparent, 
      rgba(205, 62, 253, 0.8), 
      rgba(180, 41, 227, 0.8), 
      rgba(205, 62, 253, 0.8), 
      transparent
    );
    opacity: ${({ $scrolled }) => $scrolled ? '1' : '0'};
    transition: all 0.3s ease;
  }
  
  /* Animated background */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(205, 62, 253, 0.15) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(180, 41, 227, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(255, 91, 146, 0.05) 0%, transparent 30%);
    background-size: 200% 200%;
    animation: ${shimmerEffect} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 5;
  height: 100%;
  pointer-events: none; /* Allow clicks to pass through to elements below */
  
  /* All direct children should receive pointer events */
  > * {
    pointer-events: auto;
  }
  
  @media (max-width: 768px) {
    padding: 0;
    justify-content: center;
  }
  
  /* Add subtle light streaks */
  &:before {
    content: '';
    position: absolute;
    top: -100%;
    left: 10%;
    width: 1px;
    height: 300%;
    background: linear-gradient(to bottom, transparent, rgba(205, 62, 253, 0.1), transparent);
    transform: rotate(15deg);
    pointer-events: none;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -100%;
    right: 15%;
    width: 1px;
    height: 300%;
    background: linear-gradient(to bottom, transparent, rgba(205, 62, 253, 0.1), transparent);
    transform: rotate(-15deg);
    pointer-events: none;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    /* Keep the same positioning in mobile view */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const LogoText = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: var(--white);
  position: relative;
  line-height: 1;
  width: 100%;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(205, 62, 253, 0.2);
`;

const LogoHighlight = styled.span`
  background: linear-gradient(to right, #cd3efd, #b429e3);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 2px;
`;

const LogoAccent = styled.span`
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--accent-3);
  border-radius: 50%;
  bottom: 0;
  right: -12px;
  box-shadow: 0 0 10px var(--accent-3);
  z-index: 10;
`;

const HamburgerButton = styled.div`
  display: none; /* Hidden on desktop */
  flex-direction: column;
  cursor: pointer;
  z-index: 10;
  justify-content: center;
  align-items: center;
  
  span {
    height: 3px;
    width: 25px;
    background-color: var(--accent-2);
    margin-bottom: 4px;
    border-radius: 5px;
    transition: all 0.3s ease;
  }
  
  &:hover span {
    background-color: var(--accent-1);
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const menuPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(205, 62, 253, 0.2), inset 0 0 5px rgba(205, 62, 253, 0.1); }
  50% { box-shadow: 0 0 15px rgba(205, 62, 253, 0.3), inset 0 0 8px rgba(205, 62, 253, 0.2); }
  100% { box-shadow: 0 0 10px rgba(205, 62, 253, 0.2), inset 0 0 5px rgba(205, 62, 253, 0.1); }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  background: linear-gradient(120deg, rgba(42, 18, 82, 0.4), rgba(18, 20, 44, 0.4));
  border-radius: 30px;
  padding: 0.3rem 0.5rem;
  margin: 0 auto; /* Center the menu */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(205, 62, 253, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(205, 62, 253, 0.15);
  animation: ${menuPulse} 6s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'}; /* Support RTL layout */
  
  /* Glowing dots decoration */
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: 15%;
    width: 4px;
    height: 4px;
    background: var(--accent-2);
    border-radius: 50%;
    box-shadow: 0 0 8px 2px var(--accent-2);
    opacity: 0.7;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: 15%;
    width: 4px;
    height: 4px;
    background: var(--accent-3);
    border-radius: 50%;
    box-shadow: 0 0 8px 2px var(--accent-3);
    opacity: 0.7;
  }
  
  /* No mobile styles needed as we now have a separate MobileMenu component */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  margin: 0 0.15rem;
  display: flex;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 0.5rem 1.5rem;
    justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
  }
  
  /* Active item indicator */
  &.active a:before {
    opacity: 0.2;
  }
  
  /* Subtle separator dots between items (except last) */
  &:not(:last-child):after {
    content: '';
    position: absolute;
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(205, 62, 253, 0.3);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    margin: 0.8rem 0;
    text-align: center;
    justify-content: center;
    width: 100%;
    
    &:not(:last-child):after {
      display: none;
    }
  }
`;

const buttonGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(205, 62, 253, 0); }
  50% { box-shadow: 0 0 10px rgba(205, 62, 253, 0.3); }
  100% { box-shadow: 0 0 5px rgba(205, 62, 253, 0); }
`;

const NavLink = styled(Link)`
  color: var(--light-gray);
  font-weight: 500;
  position: relative;
  margin: 0 0.3rem;
  padding: 0.4rem 0.9rem;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  letter-spacing: 0.5px;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1;
  font-size: 0.95rem;
  
  /* Glass effect background */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(120deg, 
      rgba(205, 62, 253, 0.2), 
      rgba(180, 41, 227, 0.2)
    );
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease, transform 0.3s ease;
    border-radius: 20px;
    transform: scale(0.9);
  }
  
  /* Underline effect */
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #cd3efd, #b429e3);
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover {
    color: var(--white);
    text-shadow: 0 0 8px rgba(205, 62, 253, 0.5);
    transform: translateY(-2px) scale(1.05);
    animation: ${buttonGlow} 2s infinite;
    
    &:before {
      opacity: 0.2;
      transform: scale(1);
    }
    
    &:after {
      width: 70%;
    }
  }
  
  &:active {
    transform: translateY(1px) scale(0.98);
  }
`;

const StyledLanguageSwitcher = styled(LanguageSwitcher)`
  /* Keep round style from LanguageSwitcher.js */
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
  transition: all 0.3s ease;
  animation: ${glowPulse} 4s infinite;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(66, 165, 245, 0.2));
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  margin-left: 0.3rem;
  
  &:hover {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(66, 165, 245, 0.3));
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
`;

const LoginButton = styled.button`
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #faaa93, #82a1bf);
  color: white;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #82a1bf, #faaa93);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const NavDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #1a1a2e;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px rgba(130, 161, 191, 0.2);
  border-radius: 10px;
  padding: 0.5rem 0;
  z-index: 1;
  display: none;
  border: 1px solid rgba(130, 161, 191, 0.3);
  
  ${NavDropdown}:hover & {
    display: block;
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1.5rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(130, 161, 191, 0.2);
    color: #faaa93;
  }
`;

export default Navbar;
