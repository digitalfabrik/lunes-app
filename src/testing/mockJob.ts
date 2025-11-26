import { StandardJob } from '../models/Job'

export const mockJobs = (): StandardJob[] => [
  {
    id: { type: 'standard', id: 1 },
    name: 'First Discipline',
    icon: 'none',
    numberUnits: 1,
  },
  {
    id: { type: 'standard', id: 2 },
    name: 'Second Discipline',
    icon: 'none',
    numberUnits: 1,
  },
  {
    id: { type: 'standard', id: 3 },
    name: 'Third Discipline',
    icon: 'none',
    numberUnits: 1,
  },
]
