import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import AnalyticsConsentModal from '../AnalyticsConsentModal'

describe('AnalyticsConsentModal', () => {
  const onAllow = jest.fn()
  const onDecline = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all elements when visible', () => {
    const { getByText } = render(<AnalyticsConsentModal visible onAllow={onAllow} onDecline={onDecline} />)
    const { consentDialog } = getLabels()
    expect(getByText(consentDialog.title)).toBeDefined()
    expect(getByText(consentDialog.body)).toBeDefined()
    expect(getByText(consentDialog.allow)).toBeDefined()
    expect(getByText(consentDialog.decline)).toBeDefined()
    expect(getByText(consentDialog.privacyNotice)).toBeDefined()
  })

  it('should call onAllow when allow button is pressed', () => {
    const { getByText } = render(<AnalyticsConsentModal visible onAllow={onAllow} onDecline={onDecline} />)
    fireEvent.press(getByText(getLabels().consentDialog.allow))
    expect(onAllow).toHaveBeenCalledTimes(1)
    expect(onDecline).not.toHaveBeenCalled()
  })

  it('should call onDecline when decline button is pressed', () => {
    const { getByText } = render(<AnalyticsConsentModal visible onAllow={onAllow} onDecline={onDecline} />)
    fireEvent.press(getByText(getLabels().consentDialog.decline))
    expect(onDecline).toHaveBeenCalledTimes(1)
    expect(onAllow).not.toHaveBeenCalled()
  })
})
