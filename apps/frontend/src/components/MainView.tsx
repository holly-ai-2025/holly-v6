import React from "react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import TasksTab from "./TasksTab";
import InboxTab from "./InboxTab";
import ProjectsTab from "./ProjectsTab";
import CalendarTab from "./CalendarTab";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const MainView: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel */}
      <aside className="w-1/5 border-r bg-white">
        <LeftPanel />
      </aside>

      {/* Center Content */}
      <main className="flex-1 p-6">
        <Card className="w-full">
          <CardContent>
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="inbox">
                <InboxTab />
              </TabsContent>
              <TabsContent value="tasks">
                <TasksTab />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsTab />
              </TabsContent>
              <TabsContent value="calendar">
                <CalendarTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Right Panel */}
      <aside className="w-1/5 border-l bg-white">
        <RightPanel />
      </aside>
    </div>
  );
};

export default MainView;
