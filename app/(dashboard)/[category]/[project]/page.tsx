'use client';

import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const { category, project } = params;

  return (
    <main style={{ padding: '20px' }}>
      <h1>Project Details</h1>
      <p><strong>Category:</strong> {decodeURIComponent(category as string)}</p>
      <p><strong>Project:</strong> {decodeURIComponent(project as string)}</p>
      <p>This is a placeholder for project details.</p>
    </main>
  );
}
