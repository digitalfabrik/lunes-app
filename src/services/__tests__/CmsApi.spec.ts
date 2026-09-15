import { mocked } from 'jest-mock'

import { getJob, getJobs, getUnitsOfJob, getWords } from '../CmsApi'
import { getFromEndpoint } from '../axios'

jest.mock('../axios')

const token = 'telc_key'

const jobResponse = {
  id: 7,
  name: 'Erste Schritte',
  icon: null,
  number_units: 3,
  migrated: true,
}

const unitResponse = {
  id: 11,
  title: 'Begrüßung',
  description: 'Description',
  icon: null,
  number_words: 5,
}

const wordResponse = {
  id: 21,
  word: 'Hallo',
  article: 'keiner' as const,
  images: [],
  audio: '',
  alternative_words: [],
  example_sentence: null,
  example_sentence_audio: null,
  pronunciation: '',
}

describe('CmsApi', () => {
  beforeEach(jest.clearAllMocks)

  describe('getJobs', () => {
    it('should request the public job list without a token', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([jobResponse])

      const jobs = await getJobs()

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs')
      expect(jobs[0]?.token).toBeUndefined()
    })
  })

  describe('getJob', () => {
    it('should pass the token on and stamp it onto the job', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce(jobResponse)

      const job = await getJob({ id: { type: 'standard', id: 7 }, token })

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7', token)
      expect(job.token).toBe(token)
    })
  })

  describe('getUnitsOfJob', () => {
    it('should pass the token on and stamp it onto every unit', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([unitResponse])

      const units = await getUnitsOfJob({ id: { type: 'standard', id: 7 }, token })

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7/units', token)
      expect(units[0]?.token).toBe(token)
    })

    it('should not send a token for public content', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([unitResponse])

      const units = await getUnitsOfJob({ id: { type: 'standard', id: 7 } })

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7/units', undefined)
      expect(units[0]?.token).toBeUndefined()
    })
  })

  describe('getWords', () => {
    it('should request the public words without a token', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([wordResponse])

      const words = await getWords()

      expect(getFromEndpoint).toHaveBeenCalledWith('words', undefined)
      expect(words[0]?.token).toBeUndefined()
    })

    it('should request the words with the token and stamp it onto every word', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([wordResponse])

      const words = await getWords(token)

      expect(getFromEndpoint).toHaveBeenCalledWith('words', token)
      expect(words[0]?.token).toBe(token)
    })
  })
})
