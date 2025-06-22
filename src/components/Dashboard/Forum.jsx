import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ForumsHome from './Forums/ForumsHome.tsx';
import PostDetails from './Forums/PostDetails.tsx';

const Forum = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  return (
    <ForumContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <Routes>
        <Route path="/" element={<ForumsHome />} />
        <Route path="/:postId" element={<PostDetails />} />
      </Routes>
    </ForumContainer>
  );
};

// Styled Components
const ForumContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(81, 58, 82, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

export default Forum;
