import { loadFromEndpoint } from '../useLoadFromEndpoint'

jest.mock('../../services/axios', () => ({ get: jest.fn() }))

describe('loadFromEndpoint', () => {
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set everything correctly if loading from endpoint succeeds', async () => {
    const request = async (): Promise<string> => 'myData'

    await loadFromEndpoint(request, undefined, setData, setError, setLoading)

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading from endpoint throws an error', async () => {
    const error = new Error('myError')
    const request = async (): Promise<void> => await Promise.reject(error)
    await loadFromEndpoint(request, undefined, setData, setError, setLoading)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})
