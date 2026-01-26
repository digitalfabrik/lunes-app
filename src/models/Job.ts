export type StandardJobId = {
  type: 'standard'
  id: number
}

export type ProtectedJobId = {
  type: 'load-protected'
  apiKey: string
}

export type JobId = StandardJobId | ProtectedJobId

type Job = {
  id: JobId
  name: string
  icon: string | null
  numberOfUnits: number
}

export type StandardJob = Job & { id: StandardJobId }

export default Job
