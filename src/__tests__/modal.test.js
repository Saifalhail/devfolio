import React from 'react';
import { render, fireEvent, screen } from './testUtils';
import Modal from '../components/Common/Modal';

describe('Reusable Modal Component', () => {
  test('renders modal content when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <div>Modal Body</div>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Body')).toBeInTheDocument();
  });

  test('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Body</div>
      </Modal>
    );
    fireEvent.mouseDown(getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose on Escape key', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Body</div>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
