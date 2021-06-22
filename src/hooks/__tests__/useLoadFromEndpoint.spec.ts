import { loadFromEndpoint } from '../useLoadFromEndpoint'
import axios from '../../utils/axios'
import { mocked } from 'ts-jest/utils'

jest.mock('../../utils/axios', () => ({ get: jest.fn() }))

describe('loadFromEndpoint', () => {
  const apiUrl = 'https://my-cust.om/api-url'
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set everything correctly if loading from endpoint succeeds', async () => {
    mocked(axios.get).mockImplementationOnce(async () => 'myData')

    await loadFromEndpoint(apiUrl, setData, setError, setLoading)

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading from endpoint throws an error', async () => {
    const error = new Error('myError')
    mocked(axios.get).mockImplementationOnce(async () => await Promise.reject(error))
    await loadFromEndpoint(apiUrl, setData, setError, setLoading)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})
