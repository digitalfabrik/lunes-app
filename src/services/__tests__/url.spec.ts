import { mocked } from 'jest-mock'
import { Linking } from 'react-native'

import { addTrailingSlashToUrl, openExternalUrl } from '../url'

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

describe('url', () => {
  it('should successfully open an url', async () => {
    mocked(Linking.canOpenURL).mockResolvedValueOnce(true)
    mocked(Linking.openURL).mockImplementationOnce(Promise.resolve)

    const url = 'https://lunes-app.de'

    await openExternalUrl(url)

    expect(Linking.canOpenURL).toHaveBeenCalledWith(url)
    expect(Linking.openURL).toHaveBeenCalledWith(url)
  })

  it('should add trailing slash to url', () => {
    const url = 'https://lunes-app.de'

    expect(addTrailingSlashToUrl(url)).toBe('https://lunes-app.de/')
  })

  it('should not add trailing slash to url', () => {
    const url = 'https://lunes-app.de/'

    expect(addTrailingSlashToUrl(url)).toBe('https://lunes-app.de/')
  })
})
