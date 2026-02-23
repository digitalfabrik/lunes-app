import axios, { AxiosHeaders } from 'axios'
import { mocked } from 'jest-mock'

import { getFromEndpoint } from '../axios'

jest.mock('axios', () => {
  const mockGet = jest.fn()
  return {
    ...jest.requireActual('axios'),
    create: jest.fn(() => ({ get: mockGet, post: jest.fn() })),
    get: mockGet,
  }
})

jest.mock('axios-cache-interceptor', () => ({ setupCache: jest.fn(), buildKeyGenerator: jest.fn() }))

beforeEach(() => {
  jest.clearAllMocks()
})

const response = {
  status: 200,
  statusText: 'ok',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
  },
}

describe('getFromEndpoint', () => {
  it('should get data from endpoint', async () => {
    const data = 'myData'
    mocked<typeof axios.get<string>>(axios.get).mockImplementationOnce(async () => ({ data, ...response }))

    const path = 'abc'
    const responseData = await getFromEndpoint(path)
    expect(responseData).toBe(data)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/v2/abc', { headers: undefined })
  })

  it('should include api key in header', async () => {
    const data = 'myData'
    mocked<typeof axios.get<string>>(axios.get).mockImplementationOnce(async () => ({ data, ...response }))

    const path = 'abc'
    const apiKey = 'my_api_key'
    await getFromEndpoint(path, apiKey)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://lunes-test.tuerantuer.org/api/v2/abc', {
      headers: { Authorization: `Api-Key ${apiKey}` },
    })
  })
})
