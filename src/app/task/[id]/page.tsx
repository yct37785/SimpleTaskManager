'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';

export default function TaskPage() {
  const params = useParams();
  const { id } = params;

  return (
    <main>
      <h1>Task Details</h1>
      <p className={styles.taskId}>Task ID: {id}</p>
      <p className={styles.description}>[ Task details would go here ]</p>
    </main>
  );
}
