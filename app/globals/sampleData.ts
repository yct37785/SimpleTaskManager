import { genWorkspace } from './sampleDataHelper';
import { v4 as uuidv4 } from 'uuid';
// schemas
import { Workspace } from '@schemas';

// generate workspaces
const sampleWorkspaceTitles: string[] = [
  'Midterms Planner',
  'Fitness Goals',
  'WebDev Projects',
  'Personal Development',
];

// convert to Record<string, Workspace> with random UUID keys
const sampleWorkspaces: Record<string, Workspace> = Object.fromEntries(
  sampleWorkspaceTitles.map(title => {
    const id = uuidv4();
    return [id, genWorkspace(title, id)]
  })
);

export default sampleWorkspaces;