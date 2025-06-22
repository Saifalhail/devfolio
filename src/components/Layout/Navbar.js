import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import AuthModal from '../Common/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ showUserAccount }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

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
    <Nav $scrolled={isScrolled} $isDashboard={isDashboard} $isRTL={isRTL} className={isDashboard ? 'with-sidebar' : ''}>
      {/* Desktop: Logo in corner, Mobile: Logo centered */}
      <NavContainer>
        {/* Desktop view: Split layout with menu centered and user account on right */}
        <DesktopMenu>
          {/* Main Navigation Links */}
          <NavMenu $isRTL={isRTL}>
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
          </NavMenu>
          
          {/* User Account and Language Switcher */}
          <UserControls $isRTL={isRTL}>
            <NavItem>
              <StyledLanguageSwitcher />
            </NavItem>
            {(currentUser || isDashboard) && (
              <NavItem>
                <UserAccountContainer $isRTL={isRTL}>
                  <UserInfo>
                    <FaUser />
                    <span>{currentUser?.displayName || 'Developer'}</span>
                  </UserInfo>
                  <LogoutButton onClick={handleLogout} $isRTL={isRTL}>
                    <FaSignOutAlt />
                    <span>{t('navbar.logout', 'Logout')}</span>
                  </LogoutButton>
                </UserAccountContainer>
              </NavItem>
            )}
          </UserControls>
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
      <LogoWrapper $isRTL={isRTL} isDashboard={isDashboard}>
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
      <HamburgerWrapper $isRTL={isRTL}>
        <HamburgerButton onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerButton>
      </HamburgerWrapper>
      
      {/* Mobile Menu - Separate from desktop menu */}
      <MobileMenu $isOpen={isOpen} $isRTL={isRTL}>
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
        {(currentUser || isDashboard) && (
          <NavItem>
            <MobileUserAccountContainer $isRTL={isRTL}>
              <UserInfo>
                <FaUser />
                <span>{currentUser?.displayName || 'Developer'}</span>
              </UserInfo>
              <LogoutButton onClick={handleLogout} $isRTL={isRTL}>
                <FaSignOutAlt />
                <span>{t('navbar.logout', 'Logout')}</span>
              </LogoutButton>
            </MobileUserAccountContainer>
          </NavItem>
        )}
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
  text-align: ${props => props.$isRTL ? 'right' : 'left'};
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
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
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
  align-items: center;
  padding-left: 60px; /* Space for logo */
  padding-right: 120px; /* Space for AR button and user account */
  
  @media (max-width: 768px) {
    display: none;
  }
`;
const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  ${props => props.$isRTL ? 'right' : 'left'}: 0;
  height: 100%;
  display: flex; /* Always show logo */
  align-items: center;
  padding: 0 1.5rem;
  z-index: 10;
  transition: all 0.3s ease;
  pointer-events: none; /* Allow clicks to pass through */
  
  /* Logo itself should receive pointer events */
  > * {
    pointer-events: auto;
  }
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile as we're using MobileLogoWrapper instead */
  }
`;

const HamburgerWrapper = styled.div`
  position: absolute;
  top: 0;
  ${props => props.$isRTL ? 'left' : 'right'}: 0;
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
  height: ${({ $scrolled }) => $scrolled ? '60px' : '70px'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: ${({ $scrolled }) => $scrolled ? '2px solid #cd3efd' : 'none'};
  box-shadow: ${({ $scrolled }) => $scrolled ? '0 10px 30px rgba(205, 62, 253, 0.2)' : '0 5px 15px rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    left: 0;
    right: 0;
    width: 100%;
  }
  
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
  
  /* Subtle gradient background - no animation */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to right, rgba(18, 20, 44, 0.85), rgba(42, 18, 82, 0.85), rgba(18, 20, 44, 0.85));
    pointer-events: none;
    z-index: -1;
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

const UserControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  background: linear-gradient(120deg, rgba(42, 18, 82, 0.4), rgba(18, 20, 44, 0.4));
  border-radius: 30px;
  padding: 0.3rem 0.5rem;
  margin: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(205, 62, 253, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(205, 62, 253, 0.15);
  animation: ${menuPulse} 6s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'}; /* Support RTL layout */
  width: auto; /* Allow natural width */
  
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
    justify-content: ${props => props.$isRTL ? 'flex-end' : 'flex-start'};
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

// User Account Styles for Navbar
const MobileUserAccountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 0.6rem 1rem;
  margin: 0.5rem auto;
  width: 90%;
  max-width: 300px;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
    padding: 0.8rem 1rem;
  }
`;

const UserAccountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 0.2rem 0.4rem;
  margin-left: 0.3rem;
  direction: ${props => props.$isRTL ? 'rtl' : 'ltr'};
  
  @media (max-width: 1100px) {
    gap: 0.2rem;
    padding: 0.2rem 0.3rem;
  }
  
  /* Dashboard specific styling */
  .with-sidebar & {
    margin-right: ${props => props.$isRTL ? '1rem' : '0'};
    margin-left: ${props => props.$isRTL ? '0' : '1rem'};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: white;
  font-size: 0.8rem;
  
  svg {
    color: #faaa93;
    font-size: 0.9rem;
  }
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
    
    @media (max-width: 1100px) {
      max-width: 60px;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: #513a52;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  svg {
    font-size: 0.7rem;
  }
  
  &:hover {
    background: #82a1bf;
  }
`;

export default Navbar;
