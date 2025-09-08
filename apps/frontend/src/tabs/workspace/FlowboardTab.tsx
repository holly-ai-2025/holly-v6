import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const FlowboardTab = () => {
  const [phases, setPhases] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/phases_with_tasks").then((res) => {
      setPhases(res.data);
    });
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    // Implement reorder logic here
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Flowboard</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={2} overflow="auto">
          {phases.map((phase, idx) => (
            <Droppable droppableId={String(phase.id)} key={phase.id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width={300}
                  minHeight={500}
                  p={2}
                  bgcolor="#f0f0f0"
                  borderRadius={2}
                >
                  <Typography variant="subtitle1">{phase.name}</Typography>
                  {phase.tasks.map((task: any, index: number) => (
                    <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          p={1}
                          mt={1}
                          bgcolor="white"
                          borderRadius={1}
                          boxShadow={1}
                        >
                          {task.name}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default FlowboardTab;