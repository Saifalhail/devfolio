import React from 'react';
import styled from 'styled-components';
import { Card } from '../../styles/GlobalComponents';
import { useTranslation } from 'react-i18next';

const SummaryCardWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: ${props => props.color || '#cd3efd'};
`;

const ValueText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
`;

const LabelText = styled.div`
  font-size: 0.9rem;
  color: #ccc;
`;

const SummaryCard = ({ icon, title, value, color }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <SummaryCardWrapper dir={isRTL ? 'rtl' : 'ltr'}>
      {icon && <IconWrapper color={color}>{icon}</IconWrapper>}
      {value !== undefined && <ValueText>{value}</ValueText>}
      <LabelText>{title}</LabelText>
    </SummaryCardWrapper>
  );
};

export default SummaryCard;
