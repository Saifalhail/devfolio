import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  EmptyState
} from '../../../styles/GlobalComponents';
import { colors, spacing, borderRadius, shadows, typography, mixins } from '../../../styles/GlobalTheme';

/**
 * InvoiceDisplay component
 * Reusable component for showing invoice details and payment status
 * Can be extended for listing multiple invoices or embedding in other panels
 */
const InvoiceDisplay = ({ invoice }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { label, color } = React.useMemo(() => {

    if (!invoice) {
      return { label: '', color: 'neutral' };
    }
    switch (invoice.status) {

      case 'paid':
        return { label: t('invoices.status.paid', 'Paid'), color: 'success' };
      case 'pending':
        return { label: t('invoices.status.pending', 'Pending'), color: 'warning' };
      case 'overdue':
        return { label: t('invoices.status.overdue', 'Overdue'), color: 'error' };
      default:

        return { label: invoice.status, color: 'neutral' };
    }
  }, [invoice?.status, t]);


  if (!invoice) {
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>{t('invoices.title', 'Invoices')}</PanelTitle>
        </PanelHeader>
        <EmptyState>
          <p>{t('invoices.noInvoices', 'No invoices available')}</p>
        </EmptyState>
      </PanelContainer>
    );
  }

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return format(d, 'PPP', { locale: isRTL ? ar : enUS });
  };



  const getStatusMeta = (status) => {
    switch (status) {
      case 'paid':
        return { label: t('invoices.status.paid', 'Paid'), color: 'success' };
      case 'pending':
        return { label: t('invoices.status.pending', 'Pending'), color: 'warning' };
      case 'overdue':
        return { label: t('invoices.status.overdue', 'Overdue'), color: 'error' };
      default:
        return { label: status, color: 'neutral' };
    }
  };

  const { label, color } = getStatusMeta(invoice.status);

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>{t('invoices.title', 'Invoices')}</PanelTitle>
      </PanelHeader>
      <InvoiceCard dir={isRTL ? 'rtl' : 'ltr'}>
        <Row>
          <Label>{t('invoices.fields.id', 'Invoice #')}</Label>
          <Value>{invoice.id}</Value>
        </Row>
        <Row>
          <Label>{t('invoices.fields.issueDate', 'Issued')}</Label>
          <Value>{formatDate(invoice.issueDate)}</Value>
        </Row>
        <Row>
          <Label>{t('invoices.fields.dueDate', 'Due')}</Label>
          <Value>{formatDate(invoice.dueDate)}</Value>
        </Row>
        <Row>
          <Label>{t('invoices.fields.amount', 'Amount')}</Label>
          <Value>{invoice.amount}</Value>
        </Row>
        <Row>
          <Label>{t('invoices.fields.status', 'Status')}</Label>
          <Status $status={color}>{label}</Status>
        </Row>
      </InvoiceCard>
    </PanelContainer>
  );
};

const InvoiceCard = styled.div`
  background: ${colors.gradients.card};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.sm};
  padding: ${spacing.lg};
  color: ${colors.text.primary};
`;

const Row = styled.div`
  ${mixins.flexBetween};
  margin-bottom: ${spacing.md};
`;

const Label = styled.span`
  color: ${colors.text.muted};
  font-size: ${typography.fontSizes.sm};
`;

const Value = styled.span`
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
`;

const Status = styled.span`
  ${({ $status }) => mixins.statusBadge($status)};
  text-transform: capitalize;
`;

export default React.memo(InvoiceDisplay);
