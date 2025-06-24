import styled from 'styled-components';

// Shared header styles to ensure consistent alignment across sections
export const HeaderStyles = {
  wrapper: `
    padding: 0;
    margin: 0;
  `,
  header: `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0;
    height: 60px;
    
    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      background: linear-gradient(135deg, #cd3efd, #7b2cbf);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      padding-bottom: 0.5rem;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 3px;
        background: linear-gradient(135deg, #cd3efd, #7b2cbf);
        border-radius: 3px;
      }
    }
  `
};

// Create a shared SectionTitle component for perfect alignment
export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #cd3efd, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(135deg, #cd3efd, #7b2cbf);
    border-radius: 3px;
  }
`;
