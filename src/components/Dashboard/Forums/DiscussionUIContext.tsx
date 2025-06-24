import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx { selectedId: string|null; setSelectedId:(id:string|null)=>void }
const DiscussionCtx = createContext<Ctx>({ selectedId:null, setSelectedId:()=>{} });

export const DiscussionUIProvider = ({children}:{children:ReactNode})=>{
  const [selectedId,setSelectedId]=useState<string|null>(null);
  return <DiscussionCtx.Provider value={{selectedId,setSelectedId}}>{children}</DiscussionCtx.Provider>;
};
export const useDiscussionUI = () => useContext(DiscussionCtx);
