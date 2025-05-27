import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState as StyledEmptyState, EmptyStateIcon } from '../../styles/GlobalComponents';
import { FaBoxOpen } from 'react-icons/fa';

/**
 * Generic empty state component for dashboard sections.
 * Displays an icon, title and message when no data is available.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * @param {React.ReactNode} [props.title] - Title text
 * @param {React.ReactNode} [props.message] - Description text
 * @param {React.ReactNode} [props.children] - Additional elements like action buttons
 */
const EmptyState = ({ icon = <FaBoxOpen />, title, message, children }) => (
  <StyledEmptyState>
    {icon && <EmptyStateIcon>{icon}</EmptyStateIcon>}
    {title && <h3>{title}</h3>}
    {message && <p>{message}</p>}
    {children}
  </StyledEmptyState>
);

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
  message: PropTypes.node,
  children: PropTypes.node,
};

export default EmptyState;
