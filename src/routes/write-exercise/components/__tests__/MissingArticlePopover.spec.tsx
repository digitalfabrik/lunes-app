import React from 'react'

import render from '../../../../testing/render'
import MissingArticlePopover from '../MissingArticlePopover'

jest.mock('react-native-popover-view', () => ({
  __esModule: true,
  default: 'Popover',
  PopoverPlacement: 'top'
}))

describe('MissingArticlePopover', () => {
  it('should show Popover when visible', () => {
    const { getByTestId } = render(<MissingArticlePopover setIsPopoverVisible={jest.fn()} isVisible />)
    expect(getByTestId('popover').props.isVisible).toBeTruthy()
  })
  // Unfortunately jest renders the popover(modal) even if it's set to invisible
  it('should not show Popover when invisible', () => {
    const { getByTestId } = render(<MissingArticlePopover setIsPopoverVisible={jest.fn()} isVisible={false} />)
    expect(getByTestId('popover').props.isVisible).toBeFalsy()
  })
})
