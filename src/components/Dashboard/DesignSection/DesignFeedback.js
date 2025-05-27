import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaReply } from 'react-icons/fa';
import { PanelContainer, PanelHeader, PanelTitle } from '../../../styles/GlobalComponents';
import { colors, spacing, mixins } from '../../../styles/GlobalTheme';
import Button from '../../Common/Button';
import { FormTextarea } from '../../Common/FormComponents';

const DesignFeedback = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const STORAGE_KEY = 'designFeedback';
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  // Load saved comments on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComments(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse stored feedback', err);
    }
  }, []);

  // Persist comments when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch (err) {
      console.error('Failed to store feedback', err);
    }
  }, [comments]);

  const addComment = (parentId = null) => {
    if (!text.trim()) return;
    const newComment = {
      id: Date.now(),
      parentId,
      text,
      createdAt: Date.now(),
      resolved: false,
    };
    setComments([...comments, newComment]);
    setText('');
    setReplyTo(null);
  };

  const toggleResolved = (id) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, resolved: !c.resolved } : c
      )
    );
  };

  const renderComments = (parentId = null, level = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <Comment key={c.id} level={level} dir={isRTL ? 'rtl' : 'ltr'}>
          <CommentText resolved={c.resolved}>{c.text}</CommentText>
          <CommentMeta>
            <span>{new Date(c.createdAt).toLocaleString()}</span>
            {c.resolved && (
              <ResolvedTag dir={isRTL ? 'rtl' : 'ltr'}>
                {t('designFeedback.resolved', 'Resolved')}
              </ResolvedTag>
            )}
          </CommentMeta>
          <CommentActions>
            <ActionButton
              size="small"
              variant="text"
              onClick={() => toggleResolved(c.id)}
            >
              {c.resolved
                ? t('designFeedback.reopen', 'Reopen')
                : t('designFeedback.resolve', 'Resolve')}
            </ActionButton>
            <ActionButton
              size="small"
              variant="text"
              onClick={() => setReplyTo(c.id)}
            >
              <FaReply /> {t('designFeedback.reply', 'Reply')}
            </ActionButton>
          </CommentActions>
          {replyTo === c.id && (
            <ReplyForm
              onSubmit={(e) => {
                e.preventDefault();
                addComment(c.id);
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <FormTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t(
                  'designFeedback.commentPlaceholder',
                  'Write your feedback...'
                )}
                rows={3}
                isRTL={isRTL}
              />
              <Button variant="primary" size="small" type="submit">
                {t('designFeedback.addComment', 'Add Comment')}
              </Button>
            </ReplyForm>
          )}
          {renderComments(c.id, level + 1)}
        </Comment>
      ));

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('designFeedback.title', 'Design Feedback')}</PanelTitle>
      </PanelHeader>
      <CommentForm
        onSubmit={(e) => {
          e.preventDefault();
          addComment();
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <FormTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t(
            'designFeedback.commentPlaceholder',
            'Write your feedback...'
          )}
          rows={3}
          isRTL={isRTL}
        />
        <Button variant="primary" type="submit">
          {t('designFeedback.addComment', 'Add Comment')}
        </Button>
      </CommentForm>
      <CommentsList>{renderComments()}</CommentsList>
    </PanelContainer>
  );
};

const CommentsList = styled.div`
  margin-top: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Comment = styled.div`
  border-left: 3px solid ${colors.accent.primary};
  padding-left: ${spacing.sm};
  margin-left: ${({ level }) => level * 1}rem;
`;

const CommentText = styled.p`
  margin: 0 0 ${spacing.xs} 0;
  color: ${({ resolved }) =>
    resolved ? colors.text.muted : colors.text.primary};
  text-decoration: ${({ resolved }) => (resolved ? 'line-through' : 'none')};
`;

const CommentMeta = styled.div`
  ${mixins.truncate};
  font-size: 0.8rem;
  color: ${colors.text.muted};
  margin-bottom: ${spacing.xs};
`;

const ResolvedTag = styled.span`
  ${mixins.statusBadge('success')};
  margin-${({ dir }) => (dir === 'rtl' ? 'right' : 'left')}: ${spacing.xs};
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.xs};
`;

const ActionButton = styled(Button)`
  svg {
    margin-${({ dir }) => (dir === 'rtl' ? 'left' : 'right')}: 0.25rem;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const ReplyForm = styled(CommentForm)`
  margin-top: 0.5rem;
`;

export default DesignFeedback;
