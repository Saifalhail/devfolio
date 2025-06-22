import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { 
  Card, 
  SummaryCard, 
  SummaryCardIcon, 
  SummaryCardContent, 
  SummaryCardTitle, 
  SummaryCardValue,
  TaskCard,
  TaskCardHeader,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  TaskMetaItem,
  TaskStatusBadge,
  TaskPriorityBadge,
  TaskDueDate,
  TaskAssignee,
  IconFeatureCard,
  IconFeatureCardIcon,
  AnimatedCard,
  GradientBorderCard,
  FloatingCard,
  InteractiveCard
} from '../../styles/GlobalComponents';
import { colors, spacing } from '../../styles/GlobalTheme';

/**
 * DashboardCard - A versatile card component that can be used across all dashboard tabs
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Card variant (default, summary, task, feature, animated, gradient, floating, interactive)
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Value to display (for summary cards)
 * @param {string} props.status - Status type (success, warning, error, info)
 * @param {boolean} props.gradient - Whether to use gradient background
 * @param {string} props.accentColor - Custom accent color for the card
 * @param {boolean} props.glow - Whether to add glow effect on hover
 * @param {string} props.glowColor - Custom glow color
 * @param {boolean} props.interactive - Whether the card is interactive
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Card content
 */
const DashboardCard = ({ 
  variant = 'default',
  icon,
  title,
  value,
  status,
  gradient = false,
  accentColor,
  glow = false,
  glowColor,
  interactive={undefined},
  onClick,
  children,
  ...props
}) => {
  // Render different card variants
  switch (variant) {
    case 'summary':
      return (
        <SummaryCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {icon && <SummaryCardIcon status={status}>{icon}</SummaryCardIcon>}
          <SummaryCardContent>
            <SummaryCardTitle>{title}</SummaryCardTitle>
            <SummaryCardValue gradient={gradient}>{value}</SummaryCardValue>
          </SummaryCardContent>
        </SummaryCard>
      );
      
    case 'task':
      return (
        <TaskCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          status={props.status}
          {...props}
        >
          <TaskCardHeader>
            <TaskTitle>{title}</TaskTitle>
            {props.priority && (
              <TaskPriorityBadge priority={props.priority}>
                {props.priority.charAt(0).toUpperCase() + props.priority.slice(1)}
              </TaskPriorityBadge>
            )}
          </TaskCardHeader>
          
          {props.description && <TaskDescription>{props.description}</TaskDescription>}
          
          {children}
          
          {(props.dueDate || props.assignee || props.status) && (
            <TaskMeta>
              <div style={{ display: 'flex', gap: '12px' }}>
                {props.dueDate && (
                  <TaskMetaItem>
                    {props.dueDateIcon}
                    <span>{props.dueDate}</span>
                  </TaskMetaItem>
                )}
                
                {props.assignee && (
                  <TaskMetaItem>
                    {props.assigneeIcon}
                    <span>{props.assignee}</span>
                  </TaskMetaItem>
                )}
              </div>
              
              {props.status && (
                <TaskStatusBadge status={props.status}>
                  {props.statusIcon && props.statusIcon}
                  {props.statusText || props.status.charAt(0).toUpperCase() + props.status.slice(1)}
                </TaskStatusBadge>
              )}
            </TaskMeta>
          )}
        </TaskCard>
      );
      
    case 'feature':
      return (
        <IconFeatureCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {icon && <IconFeatureCardIcon>{icon}</IconFeatureCardIcon>}
          {title && <FeatureTitle>{title}</FeatureTitle>}
          {children}
        </IconFeatureCard>
      );
      
    case 'animated':
      return (
        <AnimatedCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {children}
        </AnimatedCard>
      );
      
    case 'gradient':
      return (
        <GradientBorderCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {children}
        </GradientBorderCard>
      );
      
    case 'floating':
      return (
        <FloatingCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {children}
        </FloatingCard>
      );
      
    case 'interactive':
      return (
        <InteractiveCard 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={true}
          onClick={onClick}
          {...props}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {children}
        </InteractiveCard>
      );
      
    default:
      return (
        <Card 
          gradient={gradient}
          accentColor={accentColor}
          glow={glow}
          glowColor={glowColor}
          interactive={interactive ? true : undefined}
          onClick={interactive ? onClick : undefined}
          {...props}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {children}
        </Card>
      );
  }
};

// Additional styled components for the card system
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${spacing.md} 0;
  color: ${colors.text.primary};
`;

const TaskCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 ${spacing.sm} 0;
  color: ${colors.text.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: ${spacing.md} 0;
  color: ${colors.text.primary};
`;

// PropTypes
DashboardCard.propTypes = {
  variant: PropTypes.oneOf(['default', 'summary', 'task', 'feature', 'animated', 'gradient', 'floating', 'interactive']),
  icon: PropTypes.node,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'todo', 'doing', 'done', 'blocked']),
  gradient: PropTypes.bool,
  accentColor: PropTypes.string,
  glow: PropTypes.bool,
  glowColor: PropTypes.string,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  // Task card specific props
  description: PropTypes.string,
  priority: PropTypes.oneOf(['low', 'medium', 'high']),
  dueDate: PropTypes.string,
  dueDateIcon: PropTypes.node,
  assignee: PropTypes.string,
  assigneeIcon: PropTypes.node,
  statusText: PropTypes.string,
  statusIcon: PropTypes.node
};

export default DashboardCard;
