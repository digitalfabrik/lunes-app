import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { deleteAnalyticsData } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import SettingsScreen from '../SettingsScreen'

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '2022.6.0'),
}))

jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent').default
  return {
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
  }
})

jest.mock('../components/DebugModal', () => {
  const Text = require('react-native').Text
  return () => <Text>DebugModal</Text>
})

jest.mock('../../../services/CmsApi', () => ({
  deleteAnalyticsData: jest.fn(),
}))

describe('SettingsScreen', () => {
  const navigation = createNavigationMock<'Settings'>()
  let storageCache: StorageCache

  beforeEach(() => {
    jest.clearAllMocks()
    storageCache = StorageCache.createDummy()
  })

  it('should render all elements', () => {
    const { getByText, queryByText } = renderWithStorageCache(storageCache, <SettingsScreen navigation={navigation} />)
    expect(getByText(getLabels().settings.settings)).toBeVisible()
    expect(getByText(getLabels().settings.analyticsConsent)).toBeVisible()
    expect(getByText(getLabels().settings.analyticsConsentExplanation)).toBeVisible()
    expect(queryByText(getLabels().settings.requestAnalyticsData)).not.toBeVisible()
    expect(queryByText(getLabels().settings.deleteAnalyticsData)).not.toBeVisible()
    expect(getByText(`${getLabels().settings.version}: 2022.6.0`)).toBeVisible()
  })

  it('should show gdpr controls when analytics consent is given', async () => {
    await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: new Date().toISOString() })
    const { getByText } = renderWithStorageCache(storageCache, <SettingsScreen navigation={navigation} />)
    expect(getByText(getLabels().settings.requestAnalyticsData)).toBeVisible()
    expect(getByText(getLabels().settings.deleteAnalyticsData)).toBeVisible()
  })

  it('should show success modal after deleting analytics data', async () => {
    mocked(deleteAnalyticsData).mockResolvedValue(undefined)
    await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: new Date().toISOString() })
    await storageCache.setItem('installationId', 'test-installation-id')
    const { getByText } = renderWithStorageCache(storageCache, <SettingsScreen navigation={navigation} />)

    fireEvent.press(getByText(getLabels().settings.deleteAnalyticsData))

    await waitFor(() => {
      expect(getByText(getLabels().settings.deleteAnalyticsDataSuccess)).toBeVisible()
    })
    expect(deleteAnalyticsData).toHaveBeenCalledWith('test-installation-id')
  })

  it('should show error modal when deleting analytics data fails', async () => {
    mocked(deleteAnalyticsData).mockRejectedValue(new Error('Network error'))
    await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: new Date().toISOString() })
    await storageCache.setItem('installationId', 'test-installation-id')
    const { getByText } = renderWithStorageCache(storageCache, <SettingsScreen navigation={navigation} />)

    fireEvent.press(getByText(getLabels().settings.deleteAnalyticsData))

    await waitFor(() => {
      expect(getByText(getLabels().settings.deleteAnalyticsDataError)).toBeVisible()
    })
  })

  it('should navigate to GdprExport when pressing export button', async () => {
    await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: new Date().toISOString() })
    const { getByText } = renderWithStorageCache(storageCache, <SettingsScreen navigation={navigation} />)

    fireEvent.press(getByText(getLabels().settings.requestAnalyticsData))

    expect(navigation.navigate).toHaveBeenCalledWith('GdprExport')
  })
})
