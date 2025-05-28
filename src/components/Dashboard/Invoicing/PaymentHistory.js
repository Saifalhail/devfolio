import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  EmptyState,
  StatusBadge
} from '../../../styles/GlobalComponents';
import { spacing, colors, typography, borderRadius, shadows } from '../../../styles/GlobalTheme';

/**
 * PaymentHistory component
 * Displays a list of payment transactions for a project or client.
 * Can be reused in other dashboards that require showing transaction history.
 *
 * @param {Object[]} transactions - Array of transaction objects
 */
const PaymentHistory = ({ transactions = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(i18n.language);
  };

  const formatAmount = (amount) => {
    const formatter = new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'USD'
    });
    return formatter.format(amount);
  };

  return (
    <PanelContainer dir={isRTL ? 'rtl' : 'ltr'}>
      <PanelHeader>
        <PanelTitle>{t('invoices.paymentHistory', 'Payment History')}</PanelTitle>
      </PanelHeader>
      {transactions.length ? (
        <StyledTable>
          <thead>
            <tr>
              <Th>{t('invoices.fields.date', 'Date')}</Th>
              <Th>{t('invoices.fields.description', 'Description')}</Th>
              <Th>{t('invoices.fields.amount', 'Amount')}</Th>
              <Th>{t('invoices.fields.status', 'Status')}</Th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(tx => (
              <tr key={tx.id}>
                <Td>{formatDate(tx.date)}</Td>
                <Td>{tx.description}</Td>
                <Td>{formatAmount(tx.amount)}</Td>
                <Td>
                  <StatusBadge status={tx.status}>
                    {t(`invoices.statuses.${tx.status}`, tx.status)}
                  </StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      ) : (
        <EmptyState>
          <p>{t('invoices.noPayments', 'No payment records found')}</p>
        </EmptyState>
      )}
    </PanelContainer>
  );
};

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${spacing.md};
  text-align: left;

  [dir='rtl'] & {
    text-align: right;
  }

  th, td {
    padding: ${spacing.sm};
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  thead {
    background: ${colors.background.secondary};
  }
`;

const Th = styled.th`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${colors.text.secondary};
`;

const Td = styled.td`
  font-size: ${typography.fontSizes.sm};
  color: ${colors.text.primary};
`;

export default PaymentHistory;
