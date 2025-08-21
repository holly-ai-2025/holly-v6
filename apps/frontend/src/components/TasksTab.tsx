// redesigned tasks tab using shadcn/ui, dummy tasks data, framer motion

import React from "react";
import { tasks } from "../data/tasks";
import { groupTasks } from "../utils/groupTasks";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const TasksTab: React.FC = () => {
  const grouped = groupTasks(tasks);

  return (
    <div className="p-4 overflow-y-auto h-full">
      {Object.entries(grouped).map(([section, list]) => (
        <Section key={section} title={section}>
          {list.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-3">
                  <span>{task.title}</span>
                  <Button size="sm" variant="outline">
                    Done
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Section>
      ))}
    </div>
  );
};

export default TasksTab;