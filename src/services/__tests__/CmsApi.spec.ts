import { AxiosError, AxiosResponse } from 'axios'
import { mocked } from 'jest-mock'

import { InvalidContentAreaCodeError } from '../../constants/endpoints'
import { getContentAreaInfo, getJob, getJobs, getUnitsOfJob, getWords, registerContentArea } from '../CmsApi'
import { getFromEndpoint, postToEndpoint } from '../axios'

jest.mock('../axios')

const token = 'telc_token'

const areaResponse = {
  id: 1,
  name: 'telc gGmbH',
  logo: 'https://lunes.example/media/logo.png',
  secondary_logo: 'https://lunes.example/media/secondary.png',
  primary_color: '#a01915',
  learning_color: '#007dbe',
  training_color: '#027b91',
}

const branding = {
  logoUrl: 'https://lunes.example/media/logo.png',
  secondaryLogoUrl: 'https://lunes.example/media/secondary.png',
  primaryColor: '#a01915',
  learningColor: '#007dbe',
  trainingColor: '#027b91',
}

const hintResponse = {
  additional_information_title: 'Passend zu Fach.Sprache von telc',
  additional_information: 'Der Fachwortschatz passt zur telc Lehrwerksreihe Fach.Sprache.',
  additional_information_url: 'https://www.telc.net/deutsch-fuer-fachkraefte/',
  additional_information_url_label: 'Mehr über unsere Angebote für Fachkräfte',
}

const hint = {
  title: 'Passend zu Fach.Sprache von telc',
  text: 'Der Fachwortschatz passt zur telc Lehrwerksreihe Fach.Sprache.',
  url: 'https://www.telc.net/deutsch-fuer-fachkraefte/',
  urlLabel: 'Mehr über unsere Angebote für Fachkräfte',
}

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
      expect(contentArea).toEqual({ id: 1, token: 'telc_token', name: 'telc gGmbH', code: 'band-1', branding: {} })
    })

    it('should return the branding of the area', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({ data: { token: 'telc_token', area: areaResponse } } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea).toEqual({ id: 1, token: 'telc_token', name: 'telc gGmbH', code: 'band-1', branding })
    })

    it('should leave out branding the CMS has not set', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: {
          token: 'telc_token',
          area: { ...areaResponse, logo: null, secondary_logo: null, primary_color: '', learning_color: '' },
        },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea.branding).toEqual({ trainingColor: '#027b91' })
    })

    it('should ignore a color that is not a hex color', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: { token: 'telc_token', area: { ...areaResponse, primary_color: 'red', training_color: '#12345' } },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea.branding?.primaryColor).toBeUndefined()
      expect(contentArea.branding?.trainingColor).toBeUndefined()
    })

    it('should return the hint of the area', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: { token: 'telc_token', area: { ...areaResponse, ...hintResponse } },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea.hint).toEqual(hint)
    })

    it('should leave out the hint if the CMS has no text for it', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: { token: 'telc_token', area: { ...areaResponse, ...hintResponse, additional_information: '  ' } },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea.hint).toBeUndefined()
    })

    it('should leave out the optional parts of the hint the CMS has not set', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({
        data: {
          token: 'telc_token',
          area: {
            ...areaResponse,
            ...hintResponse,
            additional_information_title: '',
            additional_information_url: '',
            additional_information_url_label: '',
          },
        },
      } as never)

      const contentArea = await registerContentArea('band-1', 'installation-1')

      expect(contentArea.hint).toEqual({ text: hint.text })
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

  describe('getContentAreaInfo', () => {
    it('should post only the code and return the branding and hint without a token', async () => {
      mocked(postToEndpoint).mockResolvedValueOnce({ data: { area: { ...areaResponse, ...hintResponse } } } as never)

      const result = await getContentAreaInfo('band-1')

      expect(postToEndpoint).toHaveBeenCalledWith('areas/info/', { code: 'band-1' })
      expect(result).toEqual({ branding, hint })
    })
  })
})
