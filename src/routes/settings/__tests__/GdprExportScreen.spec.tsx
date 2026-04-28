import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Share } from 'react-native'

import { getAnalyticsExport } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import render from '../../../testing/render'
import GdprExportScreen from '../GdprExportScreen'

jest.mock('../../../services/CmsApi', () => ({
  getAnalyticsExport: jest.fn(),
}))

jest.mock('react-native/Libraries/Share/Share', () => ({
  default: { share: jest.fn().mockResolvedValue(undefined) },
}))

describe('GdprExportScreen', () => {
  const mockData = { events: [{ type: 'open', timestamp: '2026-01-01' }] }

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(getAnalyticsExport).mockResolvedValue(mockData)
  })

  it('should render the exported data as json', async () => {
    const { getByText } = render(<GdprExportScreen />)

    await waitFor(() => {
      expect(getByText(JSON.stringify(mockData, undefined, 2), {})).toBeVisible()
    })
  })

  it('should share the data when pressing the copy button', async () => {
    const { getByText } = render(<GdprExportScreen />)

    await waitFor(() => {
      expect(getByText(getLabels().settings.copyAnalyticsData)).toBeVisible()
    })

    fireEvent.press(getByText(getLabels().settings.copyAnalyticsData))

    expect(Share.share).toHaveBeenCalledWith({ message: JSON.stringify(mockData, undefined, 2) })
  })
})
