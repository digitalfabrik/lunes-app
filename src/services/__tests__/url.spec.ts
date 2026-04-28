import { mocked } from 'jest-mock'
import { Linking } from 'react-native'

import { openExternalUrl } from '../url'

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: '10',
  },
  Linking: {
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
  },
}))

describe('url', () => {
  it('should successfully open an url', async () => {
    mocked(Linking.canOpenURL).mockResolvedValueOnce(true)

    const url = 'https://lunes-app.de'

    await openExternalUrl(url)

    expect(Linking.canOpenURL).toHaveBeenCalledWith(url)
    expect(Linking.openURL).toHaveBeenCalledWith(url)
  })
})
