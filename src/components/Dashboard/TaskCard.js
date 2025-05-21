import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  FaCalendarAlt, 
  FaUserAlt, 
  FaEllipsisV, 
  FaExclamationCircle,
  FaUserCog,
  FaCheck,
  FaEdit,
  FaTrashAlt
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isDragging = false
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  // Format dates
  const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: isRTL ? ar : enUS
    });
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#ff9800';
    }
  };
  
  // Get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return t('tasks.priority.high', 'High');
      case 'medium':
        return t('tasks.priority.medium', 'Medium');
      case 'low':
        return t('tasks.priority.low', 'Low');
      default:
        return t('tasks.priority.medium', 'Medium');
    }
  };
  
  // Handle menu toggle
  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  // Handle menu item click
  const handleMenuItemClick = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    switch (action) {
      case 'edit':
        onEdit(task);
        break;
      case 'delete':
        onDelete(task.id);
        break;
      case 'todo':
        onStatusChange(task.id, 'todo');
        break;
      case 'doing':
        onStatusChange(task.id, 'doing');
        break;
      case 'done':
        onStatusChange(task.id, 'done');
        break;
      default:
        break;
    }
  };
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
    };
    
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);
  
  return (
    <Card 
      isRTL={isRTL} 
      priority={task.priority}
      isDragging={isDragging}
      onClick={() => onEdit(task)}
    >
      <CardHeader>
        <TaskTitle>{task.title}</TaskTitle>
        <MenuButton onClick={toggleMenu}>
          <FaEllipsisV />
        </MenuButton>
        
        {menuOpen && (
          <MenuDropdown isRTL={isRTL}>
            <MenuItem onClick={(e) => handleMenuItemClick(e, 'edit')}>
              <FaEdit />
              <span>{t('tasks.actions.edit', 'Edit')}</span>
            </MenuItem>
            
            {task.status !== 'todo' && (
              <MenuItem onClick={(e) => handleMenuItemClick(e, 'todo')}>
                <FaExclamationCircle />
                <span>{t('tasks.actions.moveToTodo', 'Move to To-Do')}</span>
              </MenuItem>
            )}
            
            {task.status !== 'doing' && (
              <MenuItem onClick={(e) => handleMenuItemClick(e, 'doing')}>
                <FaUserAlt />
                <span>{t('tasks.actions.moveToDoing', 'Move to Doing')}</span>
              </MenuItem>
            )}
            
            {task.status !== 'done' && (
              <MenuItem onClick={(e) => handleMenuItemClick(e, 'done')}>
                <FaCheck />
                <span>{t('tasks.actions.moveToDone', 'Move to Done')}</span>
              </MenuItem>
            )}
            
            <MenuDivider />
            
            <MenuItem onClick={(e) => handleMenuItemClick(e, 'delete')} isDelete>
              <FaTrashAlt />
              <span>{t('tasks.actions.delete', 'Delete')}</span>
            </MenuItem>
          </MenuDropdown>
        )}
      </CardHeader>
      
      {task.description && (
        <TaskDescription>
          {task.description.length > 100 
            ? `${task.description.substring(0, 100)}...` 
            : task.description
          }
        </TaskDescription>
      )}
      
      <CardFooter>
        <FooterItem>
          <PriorityBadge color={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </PriorityBadge>
          
          {task.isClientTask && (
            <ClientBadge>
              <FaUserCog />
              <span>{t('tasks.clientTask', 'Client')}</span>
            </ClientBadge>
          )}
        </FooterItem>
        
        {task.dueDate && (
          <FooterItem>
            <FaCalendarAlt />
            <span>{formatDate(task.dueDate)}</span>
          </FooterItem>
        )}
        
        {task.assignedToName && (
          <FooterItem>
            <FaUserAlt />
            <span>{task.assignedToName}</span>
          </FooterItem>
        )}
      </CardFooter>
    </Card>
  );
};

// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  border-left: 4px solid ${props => getPriorityColor(props.priority)};
  
  ${props => props.isDragging && `
    transform: rotate(2deg) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  `}
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  position: relative;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #513a52;
  flex: 1;
  line-height: 1.4;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
    color: #666;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  ${props => props.isRTL ? 'left: 0;' : 'right: 0;'}
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 180px;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  ${props => props.isDelete && `
    color: #f44336;
  `}
  
  &:hover {
    background: #f5f5f5;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
`;

const TaskDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  flex-wrap: wrap;
  
  svg {
    color: #82a1bf;
    font-size: 0.9rem;
  }
`;

const PriorityBadge = styled.div`
  background: ${props => `${props.color}20`};
  color: ${props => props.color};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClientBadge = styled.div`
  background: rgba(250, 170, 147, 0.2);
  color: #faaa93;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    color: #faaa93;
    font-size: 0.8rem;
  }
`;

// Helper function for priority color
function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return '#f44336';
    case 'medium':
      return '#ff9800';
    case 'low':
      return '#4caf50';
    default:
      return '#ff9800';
  }
}

export default TaskCard;
