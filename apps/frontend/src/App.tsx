import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MainView } from "./components/MainView";
import { VoiceBar } from "./components/VoiceBar";

export default function App() {
  const [activeSection, setActiveSection] = useState("Inbox");
  const [voiceActive, setVoiceActive] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <div className="flex flex-col flex-1 relative">
        <TopBar onToggleVoice={() => setVoiceActive(!voiceActive)} />
        <MainView section={activeSection} />
        <VoiceBar open={voiceActive} onClose={() => setVoiceActive(false)} />
      </div>
    </div>
  );
}