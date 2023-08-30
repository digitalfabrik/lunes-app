import axios from 'axios'
import { mocked } from 'jest-mock'

import { getFromEndpoint } from '../axios'

jest.mock('axios', () => ({ get: jest.fn() }))

jest.mock('axios-cache-interceptor', () => ({ setupCache: jest.fn(), buildKeyGenerator: jest.fn() }))

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
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/abc', { headers: undefined })
  })

  it('should include api key in header', async () => {
    const data = 'myData'
    mocked(axios.get).mockImplementationOnce(async () => ({ data }))

    const path = 'abc'
    const apiKey = 'my_api_key'
    await getFromEndpoint(path, apiKey)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/abc', {
      headers: { Authorization: `Api-Key ${apiKey}` },
    })
  })
})
