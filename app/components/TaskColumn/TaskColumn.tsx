"use client";

// components
import { Droppable } from "@hello-pangea/dnd";
import { Task } from "../../types/Task";
import TaskCard from "../TaskCard/TaskCard";
// styles
import styles from "./TaskColumn.module.css";

type Props = {
  title: string;
  status: "TODO" | "IN_PROGRESS";
  tasks: Task[];
};

export default function TaskColumn({ title, status, tasks }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};