import { Discipline } from '../constants/endpoints'
import { getFromEndpoint } from './axios'

const Endpoints = {
  jobs: 'jobs',
}

type JobResponse = {
  id: number
  name: string
  icon: string | null
  number_units: number
}

const transformJobsResponse = ({ id, name, icon, number_units: numberUnits }: JobResponse): Discipline => ({
  id,
  title: name,
  description: '',
  icon: icon ?? undefined,
  numberOfChildren: numberUnits,
  isLeaf: false,
  parentTitle: null,
  needsTrainingSetEndpoint: false,
})

export const getJobs = async (): Promise<Discipline[]> => {
  const response = await getFromEndpoint<JobResponse[]>(Endpoints.jobs)
  return response.map(transformJobsResponse)
}
