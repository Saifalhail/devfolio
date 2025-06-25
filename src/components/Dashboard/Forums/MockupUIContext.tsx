/* ---------- src/components/dashboard/forums/MockupUIContext.tsx ----------
   Provides mockup selection state and handlers for the mockup UI. */
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Mockup } from './types';

interface MockupUIContextType { 
  selectedMockup: Mockup | null; 
  handleSelectMockup: (mockup: Mockup) => void;
  clearSelectedMockup: () => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const MockupUIContext = createContext<MockupUIContextType>({ 
  selectedMockup: null, 
  handleSelectMockup: () => {}, 
  clearSelectedMockup: () => {},
  isAddModalOpen: false,
  openAddModal: () => {},
  closeAddModal: () => {}
});

export const MockupUIProvider = ({ children = null }: { children?: ReactNode }) => {
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  
  // Handler for selecting a mockup
  const handleSelectMockup = useCallback((mockup: Mockup) => {
    setSelectedMockup(mockup);
    // Additional logic can be added here (e.g., analytics tracking, etc.)
  }, []);
  
  // Handler for clearing the selected mockup
  const clearSelectedMockup = useCallback(() => {
    setSelectedMockup(null);
  }, []);
  
  // Handlers for add mockup modal
  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);
  
  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);
  
  return (
    <MockupUIContext.Provider 
      value={{ 
        selectedMockup, 
        handleSelectMockup, 
        clearSelectedMockup,
        isAddModalOpen,
        openAddModal,
        closeAddModal
      }}
    >
      {children}
    </MockupUIContext.Provider>
  );
};

// Custom hook for accessing the mockup UI context
export const useMockupUI = () => useContext(MockupUIContext);

// For backward compatibility with existing code
export const selected = (ctx: MockupUIContextType) => ctx.selectedMockup;
export const setSelected = (ctx: MockupUIContextType) => (mockup: Mockup | null) => {
  if (mockup === null) {
    ctx.clearSelectedMockup();
  } else {
    ctx.handleSelectMockup(mockup);
  }
};
