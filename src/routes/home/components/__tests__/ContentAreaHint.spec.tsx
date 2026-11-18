import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import { openExternalUrl } from '../../../../services/url'
import { mockTelcArea } from '../../../../testing/mockContentArea'
import render from '../../../../testing/render'
import ContentAreaHint from '../ContentAreaHint'

jest.mock('../../../../services/url', () => ({ openExternalUrl: jest.fn() }))

describe('ContentAreaHint', () => {
  const { title, text, url, urlLabel } = mockTelcArea().hint!
  const hint = { title: title!, text, url: url!, urlLabel: urlLabel! }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show the title, text and link of the hint', () => {
    const { getByText, getByRole } = render(<ContentAreaHint hint={hint} />)

    expect(getByText(hint.title)).toBeDefined()
    expect(getByText(hint.text)).toBeDefined()
    expect(getByRole('link')).toBeDefined()
    expect(getByText(hint.urlLabel)).toBeDefined()
  })

  it('should open the url in the browser', () => {
    const { getByTestId } = render(<ContentAreaHint hint={hint} />)

    fireEvent.press(getByTestId('content-area-hint-link'))

    expect(openExternalUrl).toHaveBeenCalledWith(hint.url)
  })

  it('should fall back to a generic label for the link', () => {
    const { getByText } = render(<ContentAreaHint hint={{ ...hint, urlLabel: undefined }} />)

    expect(getByText(getLabels().home.contentAreaHintLink)).toBeDefined()
  })

  it('should show only the text if title and url are missing', () => {
    const { getByText, queryByText, queryByTestId } = render(<ContentAreaHint hint={{ text: hint.text }} />)

    expect(getByText(hint.text)).toBeDefined()
    expect(queryByText(hint.title)).toBeNull()
    expect(queryByTestId('content-area-hint-link')).toBeNull()
  })
})
