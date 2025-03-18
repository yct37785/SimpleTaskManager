"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Task } from "../../types/Task";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  index: number;
};

export default function TaskCard({ task, index }: Props) {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.task}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
};