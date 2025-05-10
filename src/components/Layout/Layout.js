import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 4.5rem; /* To account for fixed navbar */
`;

export default Layout;
