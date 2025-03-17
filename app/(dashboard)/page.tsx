"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from '../types/Task';
import TaskForm from '../components/TaskForm';
import styles from '../styles/MainPage.module.css';
import '../styles/globals.css';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add new task
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  // Handle drag end
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find((task) => task.id === result.draggableId);

    if (movedTask) {
      movedTask.status = result.destination.droppableId as "TODO" | "IN_PROGRESS";
      setTasks(updatedTasks);
    }
  };

  return (
    <main>
      <h1>Task Manager</h1>
      <TaskForm onAddTask={addTask} />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* TODO COLUMN */}
          <Droppable droppableId="TODO">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>TODO</h2>
                {tasks.filter(task => task.status === "TODO").map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task"
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* IN PROGRESS COLUMN */}
          <Droppable droppableId="IN_PROGRESS">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>IN PROGRESS</h2>
                {tasks.filter(task => task.status === "IN_PROGRESS").map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task"
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </main>
  );
}
