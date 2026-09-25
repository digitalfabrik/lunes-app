import { AxiosError, AxiosResponse } from 'axios'
import { mocked } from 'jest-mock'

import { InvalidContentAreaCodeError } from '../../constants/endpoints'
import { getJob, getJobs, getUnitsOfJob, getWords, registerContentArea } from '../CmsApi'
import { getFromEndpoint, postToEndpoint } from '../axios'

jest.mock('../axios')

const token = 'telc_token'

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

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs', undefined)
      expect(jobs[0]?.token).toBeUndefined()
    })

    it('should pass the token on and stamp it onto every job', async () => {
      mocked(getFromEndpoint).mockResolvedValueOnce([jobResponse])

      const jobs = await getJobs(token)

      expect(getFromEndpoint).toHaveBeenCalledWith('jobs', token)
      expect(jobs[0]?.token).toBe(token)
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

  describe('registerContentArea', () => {
    it('should post the code with the installation id and return the content area', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: { token: 'telc_token', area: { id: 1, name: 'telc gGmbH' } },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(postToEndpoint).toHaveBeenCalledWith('areas/register/', {
        code: 'band-1',
        installation_id: 'installation-1',
      })
      expect(contentArea).toEqual({ id: 1, token: 'telc_token', name: 'telc gGmbH' })
    })

    it('should reject an unknown code as an invalid area code', async () => {
      const badRequest = new AxiosError('Request failed with status code 400')
      badRequest.response = { status: 400 } as AxiosResponse
      mocked(postToEndpoint).mockRejectedValueOnce(badRequest)

      await expect(registerContentArea('nope', 'installation-1')).rejects.toThrow(InvalidContentAreaCodeError)
    })

    it('should pass other failures through unchanged', async () => {
      mocked(postToEndpoint).mockRejectedValueOnce(new Error('Network Error'))

      await expect(registerContentArea('band-1', 'installation-1')).rejects.toThrow('Network Error')
    })
  })
})
