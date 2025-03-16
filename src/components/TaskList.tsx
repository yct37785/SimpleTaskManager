'use client';

import Link from 'next/link';
import { Task } from '../types/task';
import styles from './TaskList.module.css';

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  return (
    <div>
      {tasks.length === 0 && <p>No tasks added yet.</p>}
      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.listItem}>
            <Link href={`/task/${task.id}`} className={styles.link}>
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
