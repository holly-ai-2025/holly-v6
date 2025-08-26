import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import MainContent from './MainContent';
import RightPanel from './components/RightPanel';

export default function App() {
  const [active, setActive] = useState('Inbox');

  return (
    <div className="grid grid-cols-[280px_1fr_260px] h-screen">
      <Sidebar active={active} onSelect={setActive} />
      <MainContent />
      <RightPanel open />
    </div>
  );
}
