"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Task } from "../../types/Task";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./TaskColumn.module.css";

type Props = {
  title: string;
  status: "TODO" | "IN_PROGRESS";
  tasks: Task[];
};

export default function TaskColumn({ title, status, tasks }: Props) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
          <h2>{title}</h2>
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};