import axios from 'axios'
import { mocked } from 'jest-mock'

import { getFromEndpoint } from '../../services/axios'
import { loadAsync } from '../useLoadAsync'

jest.mock('axios', () => ({ get: jest.fn() }))

jest.mock('axios-cache-interceptor', () => ({ setupCache: jest.fn() }))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getFromEndpoint', () => {
  it('should get data from endpoint', async () => {
    const data = 'myData'
    mocked(axios.get).mockImplementationOnce(async () => ({ data }))

    const path = 'abc'
    const responseData = await getFromEndpoint(path)
    expect(responseData).toBe(data)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/abc/', { headers: undefined })
  })

  it('should include api key in header', async () => {
    const data = 'myData'
    mocked(axios.get).mockImplementationOnce(async () => ({ data }))

    const path = 'abc'
    const apiKey = 'my_api_key'
    await getFromEndpoint(path, apiKey)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/abc/', {
      headers: { Authorization: `Api-Key ${apiKey}` }
    })
  })
})

describe('loadFromEndpoint', () => {
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  it('should set everything correctly if loading from endpoint succeeds', async () => {
    const request = async (): Promise<string> => 'myData'

    await loadAsync(request, undefined, setData, setError, setLoading)

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading from endpoint throws an error', async () => {
    const error = new Error('myError')
    const request = async (): Promise<void> => Promise.reject(error)
    await loadAsync(request, undefined, setData, setError, setLoading)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})
