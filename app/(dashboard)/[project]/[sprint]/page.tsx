'use client';

import { useParams } from 'next/navigation';

export default function SprintPage() {
  const params = useParams();
  const { project, sprint } = params;

  return (
    <main style={{ padding: '20px' }}>
      <h1>Sprint Details</h1>
      <p><strong>Project:</strong> {decodeURIComponent(project as string)}</p>
      <p><strong>Sprint:</strong> {decodeURIComponent(sprint as string)}</p>
      <p>This is a placeholder for sprint details.</p>
    </main>
  );
}
