/* ---------- src/components/dashboard/forums/MockupUIContext.tsx ----------
   Supplies { selected, setSelected } to open/close the modal globally. */
import { createContext, useContext, useState, ReactNode } from 'react';
import { Mockup } from './types';

interface Ctx { selected: Mockup | null; setSelected: (m: Mockup|null)=>void; }
const MockupCtx = createContext<Ctx>({ selected: null, setSelected: () => {} });

export const MockupUIProvider = ({ children = null }: { children?: ReactNode }) => {
  const [selected, setSelected] = useState<Mockup | null>(null);
  return <MockupCtx.Provider value={{ selected, setSelected }}>{children}</MockupCtx.Provider>;
};
export const useMockupUI = () => useContext(MockupCtx);
