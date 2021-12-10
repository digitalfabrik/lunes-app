import { render } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import MissingArticlePopover from '../MissingArticlePopover'

// will be fixed in LUN-230
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('MissingArticlePopover', () => {
  it('should show Popover when visible', () => {
    const { getByText } = render(<MissingArticlePopover setIsPopoverVisible={jest.fn()} isVisible={true} />, {
      wrapper: wrapWithTheme
    })
    expect(getByText(labels.exercises.write.feedback.articleMissing)).toBeDefined()
    console.log(getByText(labels.exercises.write.feedback.articleMissing))
  })

  it('should not show Popover when invisible', () => {
    const { queryByText } = render(<MissingArticlePopover setIsPopoverVisible={jest.fn()} isVisible={false} />, {
      wrapper: wrapWithTheme
    })
    expect(queryByText(labels.exercises.write.feedback.articleMissing)).toBeNull()
  })
})
