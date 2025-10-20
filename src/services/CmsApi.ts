import { Discipline, NetworkError } from '../constants/endpoints'
import { isTypeLoadProtected } from '../hooks/helpers'
import { RequestParams } from '../hooks/useLoadDiscipline'
import { getFromEndpoint } from './axios'

const Endpoints = {
  jobs: 'jobs',
  job: (id: number) => `jobs/${id}`,
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

export const getJob = async (id: RequestParams): Promise<Discipline> =>
  !isTypeLoadProtected(id)
    ? transformJobsResponse(await getFromEndpoint<JobResponse>(Endpoints.job(id.disciplineId)))
    : Promise.reject(new Error(NetworkError)) // TODO: Add support back to the cms
