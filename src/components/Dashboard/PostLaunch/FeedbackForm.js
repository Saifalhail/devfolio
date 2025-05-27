import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../Common/Button';
import { FormLabel, FormTextarea, InputGroup } from '../../Common/FormComponents';

/**
 * Post-launch feedback form for collecting client reviews.
 * This component uses existing Button and FormComponents for consistency.
 */
const FeedbackForm = ({ projectId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({ rating: '5', review: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'projectFeedback'), {
        projectId: projectId || null,
        userId: currentUser?.uid || null,
        rating: Number(formData.rating),
        review: formData.review,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ rating: '5', review: '' });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(t('postLaunch.feedbackForm.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessMessage isRTL={isRTL}>{t('postLaunch.feedbackForm.success')}</SuccessMessage>;
  }

  return (
    <Form onSubmit={handleSubmit} isRTL={isRTL}>
      <InputGroup isRTL={isRTL}>
        <FormLabel htmlFor="rating" isRTL={isRTL}>{t('postLaunch.feedbackForm.rating')}</FormLabel>
        <Select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          isRTL={isRTL}
        >
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </Select>
      </InputGroup>

      <InputGroup isRTL={isRTL}>
        <FormLabel htmlFor="review" isRTL={isRTL}>{t('postLaunch.feedbackForm.review')}</FormLabel>
        <FormTextarea
          id="review"
          name="review"
          value={formData.review}
          onChange={handleChange}
          variant="dark"
          isRTL={isRTL}
          required
        />
      </InputGroup>

      {error && <ErrorText isRTL={isRTL}>{error}</ErrorText>}

      <Button type="submit" disabled={loading}>
        {loading ? t('auth.loading') : t('postLaunch.feedbackForm.submit')}
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  direction: ${props => (props.isRTL ? 'rtl' : 'ltr')};

  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.5);
    box-shadow: 0 0 0 2px rgba(205, 62, 253, 0.2);
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 1rem;
  text-align: ${props => (props.isRTL ? 'right' : 'left')};
`;

export default FeedbackForm;
