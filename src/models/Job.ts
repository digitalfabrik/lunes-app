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
  migrated: boolean
  contentAreaToken?: string
}

export type StandardJob = Job & { id: StandardJobId }

export type SelectedJob = {
  id: number
  contentAreaToken?: string
}

export default Job
