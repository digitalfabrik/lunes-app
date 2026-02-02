import { StandardJob } from '../models/Job'

export const mockJobs = (): StandardJob[] => [
  {
    id: { type: 'standard', id: 1 },
    name: 'First Job',
    icon: 'none',
    numberOfUnits: 1,
  },
  {
    id: { type: 'standard', id: 2 },
    name: 'Second Job',
    icon: 'none',
    numberOfUnits: 1,
  },
  {
    id: { type: 'standard', id: 3 },
    name: 'Third Job',
    icon: 'none',
    numberOfUnits: 1,
  },
]
