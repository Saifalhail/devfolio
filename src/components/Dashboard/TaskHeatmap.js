import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const TaskHeatmap = ({ tasks, projectId = null }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // State for heatmap data
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Generate heatmap data based on tasks
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setHeatmapData([]);
      return;
    }
    
    // Filter tasks by project if projectId is provided
    const filteredTasks = projectId 
      ? tasks.filter(task => task.projectId === projectId)
      : tasks;
    
    // Get days in the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    // Initialize data for each day
    const monthData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(selectedYear, selectedMonth, day);
      
      return {
        date,
        day,
        count: 0,
        tasks: []
      };
    });
    
    // Count tasks for each day
    filteredTasks.forEach(task => {
      // Check tasks created in the selected month
      if (task.createdAt) {
        const createdDate = task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt);
        
        if (createdDate.getMonth() === selectedMonth && createdDate.getFullYear() === selectedYear) {
          const dayIndex = createdDate.getDate() - 1;
          if (monthData[dayIndex]) {
            monthData[dayIndex].count++;
            monthData[dayIndex].tasks.push({
              id: task.id,
              title: task.title,
              type: 'created',
              time: createdDate
            });
          }
        }
      }
      
      // Check tasks completed in the selected month
      if (task.completedAt) {
        const completedDate = task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt);
        
        if (completedDate.getMonth() === selectedMonth && completedDate.getFullYear() === selectedYear) {
          const dayIndex = completedDate.getDate() - 1;
          if (monthData[dayIndex]) {
            monthData[dayIndex].count++;
            monthData[dayIndex].tasks.push({
              id: task.id,
              title: task.title,
              type: 'completed',
              time: completedDate
            });
          }
        }
      }
      
      // Check tasks updated in the selected month
      if (task.updatedAt && task.updatedAt !== task.createdAt) {
        const updatedDate = task.updatedAt.toDate ? task.updatedAt.toDate() : new Date(task.updatedAt);
        
        if (updatedDate.getMonth() === selectedMonth && updatedDate.getFullYear() === selectedYear) {
          const dayIndex = updatedDate.getDate() - 1;
          if (monthData[dayIndex]) {
            monthData[dayIndex].count++;
            monthData[dayIndex].tasks.push({
              id: task.id,
              title: task.title,
              type: 'updated',
              time: updatedDate
            });
          }
        }
      }
    });
    
    setHeatmapData(monthData);
  }, [tasks, selectedMonth, selectedYear, projectId]);
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Get month name
  const getMonthName = (month) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString(i18n.language, { month: 'long' });
  };
  
  // Get day name
  const getDayName = (date) => {
    return date.toLocaleString(i18n.language, { weekday: 'short' });
  };
  
  // Get color intensity based on task count
  const getColorIntensity = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4 or more
  };
  
  // Render task tooltip
  const renderTaskTooltip = (day) => {
    if (day.count === 0) return null;
    
    return (
      <DayTooltip>
        <TooltipDate>
          {day.date.toLocaleDateString(i18n.language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </TooltipDate>
        
        <TooltipTaskCount>
          {t('tasks.heatmap.activityCount', '{{count}} activities', { count: day.count })}
        </TooltipTaskCount>
        
        <TooltipTaskList>
          {day.tasks.map((task, index) => (
            <TooltipTask key={`${task.id}-${index}`}>
              <TooltipTaskType type={task.type}>
                {task.type === 'created' && t('tasks.heatmap.created', 'Created')}
                {task.type === 'updated' && t('tasks.heatmap.updated', 'Updated')}
                {task.type === 'completed' && t('tasks.heatmap.completed', 'Completed')}
              </TooltipTaskType>
              <TooltipTaskTitle>{task.title}</TooltipTaskTitle>
              <TooltipTaskTime>
                {task.time.toLocaleTimeString(i18n.language, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TooltipTaskTime>
            </TooltipTask>
          ))}
        </TooltipTaskList>
      </DayTooltip>
    );
  };
  
  return (
    <HeatmapContainer isRTL={isRTL}>
      <HeatmapHeader>
        <HeatmapTitle>
          <FaCalendarAlt />
          <h3>{t('tasks.heatmap.title', 'Activity Heatmap')}</h3>
        </HeatmapTitle>
        
        <MonthNavigation>
          <MonthButton onClick={handlePreviousMonth}>
            {isRTL ? '→' : '←'}
          </MonthButton>
          
          <CurrentMonth>
            {getMonthName(selectedMonth)} {selectedYear}
          </CurrentMonth>
          
          <MonthButton onClick={handleNextMonth}>
            {isRTL ? '←' : '→'}
          </MonthButton>
        </MonthNavigation>
      </HeatmapHeader>
      
      <HeatmapLegend>
        <LegendItem>
          <LegendColor intensity={0} />
          <LegendLabel>{t('tasks.heatmap.noActivity', 'No activity')}</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor intensity={1} />
          <LegendLabel>{t('tasks.heatmap.lowActivity', '1 activity')}</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor intensity={2} />
          <LegendLabel>{t('tasks.heatmap.mediumActivity', '2 activities')}</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor intensity={3} />
          <LegendLabel>{t('tasks.heatmap.highActivity', '3 activities')}</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor intensity={4} />
          <LegendLabel>{t('tasks.heatmap.veryHighActivity', '4+ activities')}</LegendLabel>
        </LegendItem>
      </HeatmapLegend>
      
      {heatmapData.length > 0 ? (
        <HeatmapGrid>
          {heatmapData.map((day) => (
            <DayCell 
              key={day.day}
              intensity={getColorIntensity(day.count)}
              isToday={
                day.date.getDate() === new Date().getDate() &&
                day.date.getMonth() === new Date().getMonth() &&
                day.date.getFullYear() === new Date().getFullYear()
              }
            >
              <DayNumber>{day.day}</DayNumber>
              <DayName>{getDayName(day.date)}</DayName>
              {day.count > 0 && <DayCount>{day.count}</DayCount>}
              {renderTaskTooltip(day)}
            </DayCell>
          ))}
        </HeatmapGrid>
      ) : (
        <EmptyHeatmap>
          <FaInfoCircle />
          <p>{t('tasks.heatmap.noData', 'No activity data available for this month')}</p>
        </EmptyHeatmap>
      )}
    </HeatmapContainer>
  );
};

// Styled Components
const HeatmapContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const HeatmapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeatmapTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #513a52;
  }
  
  svg {
    color: #82a1bf;
    font-size: 1.2rem;
  }
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #82a1bf;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(130, 161, 191, 0.1);
  }
`;

const CurrentMonth = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #513a52;
  min-width: 150px;
  text-align: center;
`;

const HeatmapLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  
  ${props => {
    if (props.intensity === 0) return `background-color: #eee;`;
    if (props.intensity === 1) return `background-color: rgba(130, 161, 191, 0.3);`;
    if (props.intensity === 2) return `background-color: rgba(130, 161, 191, 0.5);`;
    if (props.intensity === 3) return `background-color: rgba(130, 161, 191, 0.7);`;
    return `background-color: rgba(130, 161, 191, 1);`;
  }}
`;

const LegendLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DayCell = styled.div`
  position: relative;
  padding: 0.8rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  
  ${props => {
    if (props.intensity === 0) return `background-color: #f9f9f9;`;
    if (props.intensity === 1) return `background-color: rgba(130, 161, 191, 0.1);`;
    if (props.intensity === 2) return `background-color: rgba(130, 161, 191, 0.25);`;
    if (props.intensity === 3) return `background-color: rgba(130, 161, 191, 0.4);`;
    return `background-color: rgba(130, 161, 191, 0.6);`;
  }}
  
  ${props => props.isToday && `
    border: 2px solid #faaa93;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
  }
  
  &:hover > div:last-child {
    display: block;
  }
`;

const DayNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #513a52;
`;

const DayName = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.2rem;
`;

const DayCount = styled.div`
  margin-top: 0.5rem;
  background: rgba(250, 170, 147, 0.2);
  color: #faaa93;
  border-radius: 12px;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
`;

const DayTooltip = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 250px;
  z-index: 100;
  margin-top: 0.5rem;
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
`;

const TooltipDate = styled.div`
  font-weight: 600;
  color: #513a52;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const TooltipTaskCount = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.8rem;
`;

const TooltipTaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
`;

const TooltipTask = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: #f9f9f9;
`;

const TooltipTaskType = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  
  ${props => props.type === 'created' && `color: #4caf50;`}
  ${props => props.type === 'updated' && `color: #ff9800;`}
  ${props => props.type === 'completed' && `color: #2196f3;`}
`;

const TooltipTaskTitle = styled.div`
  font-size: 0.85rem;
  color: #333;
`;

const TooltipTaskTime = styled.div`
  font-size: 0.7rem;
  color: #999;
`;

const EmptyHeatmap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  text-align: center;
  
  svg {
    font-size: 2rem;
    color: #ddd;
    margin-bottom: 1rem;
  }
  
  p {
    margin: 0;
  }
`;

export default TaskHeatmap;
