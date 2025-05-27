import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaReply } from 'react-icons/fa';
import { PanelContainer, PanelHeader, PanelTitle } from '../../../styles/GlobalComponents';
import Button from '../../Common/Button';
import { FormTextarea } from '../../Common/FormComponents';

const DesignFeedback = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const addComment = (parentId = null) => {
    if (!text.trim()) return;
    const newComment = {
      id: Date.now(),
      parentId,
      text,
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
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Comment = styled.div`
  border-left: 3px solid #6e57e0;
  padding-left: 1rem;
  margin-left: ${({ level }) => level * 1}rem;
`;

const CommentText = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${({ resolved }) => (resolved ? '#999' : '#333')};
  text-decoration: ${({ resolved }) => (resolved ? 'line-through' : 'none')};
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ActionButton = styled(Button)`
  svg {
    margin-${({ dir }) => (dir === 'rtl' ? 'left' : 'right')}: 0.25rem;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReplyForm = styled(CommentForm)`
  margin-top: 0.5rem;
`;

export default DesignFeedback;
