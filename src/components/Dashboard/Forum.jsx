import React, { useState, useRef, useEffect, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FaPaperPlane,
  FaImages,
  FaPlus,
  FaComments,
  FaRegComment,
  FaBoxOpen
} from 'react-icons/fa';
import { db, storage } from '../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useThemeContext } from '../../contexts/ThemeContext';
import { IconContainer } from '../../styles/GlobalComponents';

// --- DUMMY DATA ---
const dummyProjects = [
  { id: 'project1', name: 'DevFolio Website' },
  { id: 'project2', name: 'E-commerce Platform' },
  { id: 'project3', name: 'Mobile App Design' },
];

// --- STYLED COMPONENTS ---

const ForumBg = styled.div`
  min-height: 80vh;
  width: 100%;
  background: linear-gradient(135deg, 
    ${({ theme }) => (theme && theme.colors && theme.colors.background) ? theme.colors.background : require('../../styles/GlobalTheme').colors.background.primary} 0%, 
    ${({ theme }) => (theme && theme.colors && (theme.colors.backgroundVariant || (theme.colors.background && theme.colors.background.secondary))) ? (theme.colors.backgroundVariant || theme.colors.background.secondary) : require('../../styles/GlobalTheme').colors.background.secondary} 100%
  );
  position: relative;
  padding: 2.5rem 0 3rem 0;
  overflow-x: hidden;
`;

const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;

const PageTitle = styled.h1`
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0;
  background: ${({ theme }) =>
    theme && theme.colors && theme.colors.gradients && theme.colors.gradients.accent
      ? theme.colors.gradients.accent
      : require('../../styles/GlobalTheme').colors.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const ForumLayout = styled.div`
  display: flex;
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
    width: 98vw;
    padding: 0 0.5rem;
  }
`;

const GlassPanel = styled.div`
  flex: 1 1 48%;
  min-width: 320px;
  background: rgba(35, 38, 85, 0.75);
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  padding: 2.2rem 2rem 1.5rem 2rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.05);
  @media (max-width: 600px) {
    padding: 1.2rem 0.8rem 1rem 0.8rem;
  }
`;

const PanelHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  z-index: 2;
`;

const PanelTitleStyled = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.primary) 
      ? theme.colors.text.primary 
      : require('../../styles/GlobalTheme').colors.text.primary || '#ffffff'};
  margin: 0;
`;

const ProjectSelect = styled.select`
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => 
    (theme && theme.colors && theme.colors.border && theme.colors.border.focus) 
      ? theme.colors.border.focus 
      : require('../../styles/GlobalTheme').colors.border.focus || '#6a5acd'};
  background: rgba(28,28,36,0.45);
  color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.primary) 
      ? theme.colors.text.primary 
      : require('../../styles/GlobalTheme').colors.text.primary || '#ffffff'};
  font-size: 1.08rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 2px solid ${({ theme }) => 
      (theme && theme.colors && theme.colors.accent && theme.colors.accent.primary) 
        ? theme.colors.accent.primary 
        : require('../../styles/GlobalTheme').colors.accent.primary || '#8a2be2'};
  }
`;

// --- Chat/Discussion ---
const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.2rem;
  padding: 0 0.5rem;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => 
      (theme && theme.colors && theme.colors.accent && theme.colors.accent.primary) 
        ? theme.colors.accent.primary 
        : require('../../styles/GlobalTheme').colors.accent.primary || '#8a2be2'};
    border-radius: 10px;
  }
`;

const MessageItem = styled.div`
  margin-bottom: 1.3rem;
  display: flex;
  align-items: flex-end;
  gap: 0.7rem;
  &.own {
    flex-direction: row-reverse;
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ theme }) => 
    (theme && theme.colors && theme.colors.gradients && theme.colors.gradients.accent) 
      ? theme.colors.gradients.accent 
      : require('../../styles/GlobalTheme').colors.gradients.accent || 'linear-gradient(135deg, #8a2be2, #4b0082)'};
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(180,80,255,0.09);
  user-select: none;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $own }) => ($own ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = styled.div`
  background: ${({ $own, theme }) => $own ? 
    ((theme && theme.colors && theme.colors.gradients && theme.colors.gradients.accent) 
      ? theme.colors.gradients.accent 
      : require('../../styles/GlobalTheme').colors.gradients.accent || 'linear-gradient(135deg, #8a2be2, #4b0082)') 
    : 'linear-gradient(135deg, #4a5568, #2d3748)'};
  color: #fff;
  padding: 0.9rem 1.2rem;
  border-radius: 20px;
  border-bottom-right-radius: ${({ $own }) => ($own ? '4px' : '20px')};
  border-bottom-left-radius: ${({ $own }) => ($own ? '20px' : '4px')};
  max-width: 100%;
  font-size: 1.06rem;
  box-shadow: 0 2px 14px rgba(0,0,0,0.2);
`;

const MessageMeta = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.muted) 
      ? theme.colors.text.muted 
      : require('../../styles/GlobalTheme').colors.text.muted || '#999999'};
  margin-top: 0.4rem;
  padding: 0 0.5rem;
`;

const ChatInputBar = styled.form`
  display: flex;
  gap: 0.7rem;
  align-items: center;
  background: rgba(28,28,36,0.75);
  border-radius: 18px;
  padding: 0.4rem 0.7rem 0.4rem 1.1rem;
  margin-top: auto;
  position: sticky;
  bottom: 0;
  z-index: 3;
`;

const ChatInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.primary) 
      ? theme.colors.text.primary 
      : require('../../styles/GlobalTheme').colors.text.primary || '#ffffff'};
  font-size: 1.08rem;
  font-weight: 500;
  outline: none;
  padding: 0.7rem 0;
  &::placeholder {
    color: ${({ theme }) => 
      (theme && theme.colors && theme.colors.text && theme.colors.text.muted) 
        ? theme.colors.text.muted 
        : require('../../styles/GlobalTheme').colors.text.muted || '#999999'};
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => 
    (theme && theme.colors && theme.colors.gradients && theme.colors.gradients.accent) 
      ? theme.colors.gradients.accent 
      : require('../../styles/GlobalTheme').colors.gradients.accent || 'linear-gradient(135deg, #8a2be2, #4b0082)'};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(199, 60, 255, 0.25);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(199, 60, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// --- Images/Comments ---
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.5rem;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent.primary};
    border-radius: 10px;
  }
`;

const imageCardStyles = css`
  background: rgba(40, 42, 80, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    border-color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const ImageCard = styled.div`
  ${imageCardStyles}
  padding: 0.8rem;
`;

const AddImageCard = styled.label`
  ${imageCardStyles}
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px dashed rgba(255,255,255,0.3);
  color: ${({ theme }) => theme.colors.text.muted};
  min-height: 200px; /* Ensure it has a minimum height */

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    color: ${({ theme }) => theme.colors.accent.primary};
    background: rgba(199, 60, 255, 0.1);
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.8rem;
`;

const CommentList = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  max-height: 100px;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  strong {
    color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.primary) 
      ? theme.colors.text.primary 
      : require('../../styles/GlobalTheme').colors.text.primary || '#ffffff'};
    margin-right: 0.5rem;
  }
`;

const CommentInputForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
`;

const CommentInput = styled.input`
    flex: 1;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #444;
    background: #222;
    color: #fff;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accent.primary};
      outline: none;
    }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: ${({ theme }) => 
    (theme && theme.colors && theme.colors.text && theme.colors.text.muted) 
      ? theme.colors.text.muted 
      : require('../../styles/GlobalTheme').colors.text.muted || '#999999'};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
  }
`;

const LoadingState = styled(EmptyState)``;

const Forum = () => {
    const { t } = useTranslation();
  // Defensive fallback for theme/colors
  const { theme: themeContext } = useThemeContext();
  const GlobalThemeColors = require('../../styles/GlobalTheme').colors;
  const theme = themeContext && themeContext.colors ? themeContext : { colors: GlobalThemeColors };
  const [selectedProject, setSelectedProject] = useState(dummyProjects[0]?.id || '');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!selectedProject) return;

    setLoadingMessages(true);
    setLoadingImages(true);

    const messagesQuery = query(collection(db, 'projectForums', selectedProject, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingMessages(false);
    }, (err) => {
      console.error("Error fetching messages: ", err);
      setError('Failed to load messages.');
      setLoadingMessages(false);
    });

    const imagesQuery = query(collection(db, 'projectForums', selectedProject, 'images'), orderBy('uploadedAt', 'desc'));
    const unsubscribeImages = onSnapshot(imagesQuery, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingImages(false);
    }, (err) => {
      console.error("Error fetching images: ", err);
      setError('Failed to load images.');
      setLoadingImages(false);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeImages();
    };
  }, [selectedProject]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'projectForums', selectedProject, 'messages'), {
      text: newMessage,
      author: 'You', // Replace with actual user info
      uid: 'currentUser', // Replace with actual user ID
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const storageRef = ref(storage, `projectForums/${selectedProject}/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, 'projectForums', selectedProject, 'images'), {
        url: downloadURL,
        fileName: file.name,
        uploadedAt: serverTimestamp(),
        comments: [],
        author: 'You',
      });
    } catch (err) {
      console.error("Error uploading image: ", err);
      setError('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddComment = async (e, imageId) => {
    e.preventDefault();
    const commentText = e.target.comment.value;
    if (commentText.trim() === '') return;
    const newComment = { author: 'You', text: commentText, timestamp: new Date() };
    const imageRef = doc(db, 'projectForums', selectedProject, 'images', imageId);
    await updateDoc(imageRef, {
      comments: arrayUnion(newComment)
    });
    e.target.reset();
  };

  return (
    <ForumBg>
      <PageHeader>
        <PageTitle>{t('forum.title')}</PageTitle>
        <ProjectSelect onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
          {dummyProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </ProjectSelect>
      </PageHeader>

      {error && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center' }}>{error}</div>}

      <ForumLayout>
        {/* Chat/Discussion Panel */}
        <GlassPanel>
          <PanelHeaderStyled>
            {/* Defensive: fallback to GlobalTheme if theme/colors missing */}
            <IconContainer
              icon={FaComments}
              size="1.5em"
              color={(theme && theme.colors && theme.colors.accent && theme.colors.accent.primary) ? theme.colors.accent.primary : require('../../styles/GlobalTheme').colors.accent.primary}
            />
            <PanelTitleStyled>{t('forum.discussion_title')}</PanelTitleStyled>
          </PanelHeaderStyled>
          <MessageList ref={messagesEndRef}>
            {loadingMessages ? (
              <LoadingState><FaBoxOpen /><p>{t('loading')}</p></LoadingState>
            ) : messages.length === 0 ? (
              <EmptyState><FaComments /><p>{t('forum.no_messages')}</p></EmptyState>
            ) : (
              messages.map(msg => (
                <MessageItem key={msg.id} className={msg.uid === 'currentUser' ? 'own' : ''}>
                  <Avatar>{msg.author.charAt(0)}</Avatar>
                  <MessageContent $own={msg.uid === 'currentUser'}>
                    <MessageBubble $own={msg.uid === 'currentUser'}>{msg.text}</MessageBubble>
                    <MessageMeta>{msg.author} • {new Date(msg.timestamp?.toDate()).toLocaleTimeString()}</MessageMeta>
                  </MessageContent>
                </MessageItem>
              ))
            )}
          </MessageList>
          <ChatInputBar onSubmit={handleSendMessage}>
            <ChatInput 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder={t('forum.type_message')}
              disabled={uploadingImage}
            />
            <SendButton type="submit" disabled={!newMessage.trim() || uploadingImage}><FaPaperPlane /></SendButton>
          </ChatInputBar>
        </GlassPanel>

        {/* Images & Comments Panel */}
        <GlassPanel>
          <PanelHeaderStyled>
            <IconContainer icon={FaImages} size="1.5em" color={theme.colors.accent.primary} />
            <PanelTitleStyled>{t('forum.images_title')}</PanelTitleStyled>
          </PanelHeaderStyled>
          <ImagesGrid>
            {loadingImages ? (
              <LoadingState><FaBoxOpen /><p>{t('loading')}</p></LoadingState>
            ) : (
              <>
                <AddImageCard htmlFor="image-upload">
                  <IconContainer icon={FaPlus} size="2em" />
                  <span>{t('forum.add_image')}</span>
                  <input id="image-upload" type="file" hidden onChange={handleImageUpload} disabled={uploadingImage} />
                </AddImageCard>
                {images.map(img => (
                  <ImageCard key={img.id}>
                    <ImagePreview src={img.url} alt={t('forum.image_alt')} />
                    <CommentList>
                      {img.comments?.map((c, i) => (
                        <CommentItem key={i}><strong>{c.author}:</strong> {c.text}</CommentItem>
                      ))}
                    </CommentList>
                    <CommentInputForm onSubmit={(e) => handleAddComment(e, img.id)}>
                      <CommentInput 
                        name="comment" 
                        placeholder={t('forum.add_comment')} 
                        disabled={uploadingImage} 
                      />
                      <SendButton type="submit" disabled={uploadingImage}><FaRegComment /></SendButton>
                    </CommentInputForm>
                  </ImageCard>
                ))}
                {images.length === 0 && (
                  <EmptyState><FaImages /><p>{t('forum.no_images')}</p></EmptyState>
                )}
              </>
            )}
          </ImagesGrid>
        </GlassPanel>
      </ForumLayout>
    </ForumBg>
  );
};

export default Forum;
