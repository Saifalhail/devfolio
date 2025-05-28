import React from 'react';
import { render, screen } from './testUtils';
import FeedbackForm from '../components/Dashboard/PostLaunch/FeedbackForm';

describe('PostLaunch FeedbackForm', () => {
  test('renders rating and review fields', () => {
    render(<FeedbackForm />);
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Review/i)).toBeInTheDocument();
  });
});
