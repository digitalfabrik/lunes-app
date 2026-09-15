import { mocked } from 'jest-mock'

import { getJob, getJobs, getUnitsOfJob, getWords, getWordsWithToken } from '../CmsApi'
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
    it('should request the public job list without a key', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([jobResponse])

      const jobs = await getJobs()

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs')
      expect(jobs[0]?.contentAreaToken).toBeUndefined()
    })
  })

  describe('getJob', () => {
    it('should pass the key on and stamp it onto the job', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce(jobResponse)

      const job = await getJob({ type: 'standard', id: 7 }, token)

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7', token)
      expect(job.contentAreaToken).toBe(token)
    })
  })

  describe('getUnitsOfJob', () => {
    it('should pass the key on and stamp it onto every unit', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([unitResponse])

      const units = await getUnitsOfJob({ type: 'standard', id: 7 }, token)

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7/units', token)
      expect(units[0]?.contentAreaToken).toBe(token)
    })

    it('should not send a key for public content', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([unitResponse])

      const units = await getUnitsOfJob({ type: 'standard', id: 7 })

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs/7/units', undefined)
      expect(units[0]?.contentAreaToken).toBeUndefined()
    })
  })

  describe('getWords', () => {
    it('should request the public words without a key', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([wordResponse])

      const words = await getWords()

      expect(getFromEndpoint).toHaveBeenCalledWith('words')
      expect(words[0]?.contentAreaToken).toBeUndefined()
    })
  })

  describe('getWordsWithToken', () => {
    it('should request the words with the key and stamp it onto every word', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([wordResponse])

      const words = await getWordsWithToken(token)

      expect(getFromEndpoint).toHaveBeenCalledWith('words', token)
      expect(words[0]?.contentAreaToken).toBe(token)
    })
  })
})
