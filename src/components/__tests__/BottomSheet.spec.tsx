import { waitFor } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import useIsReducedMotionEnabled from '../../hooks/useIsReducedMotionEnabled'
import render from '../../testing/render'
import BottomSheet from '../BottomSheet'

jest.mock('../../hooks/useIsReducedMotionEnabled')

describe('BottomSheet', () => {
  const content = 'Sheet content'

  const renderSheet = (visible: boolean) =>
    render(
      <BottomSheet visible={visible}>
        <Text>{content}</Text>
      </BottomSheet>,
    )

  describe('with reduced motion', () => {
    it('should show the content while visible and hide it again once closed', async () => {
      jest.mocked(useIsReducedMotionEnabled).mockReturnValue(true)

      const { queryByText, rerender } = renderSheet(true)
      expect(queryByText(content)).toBeTruthy()

      // The sheet stays mounted until the closing animation completed, so it only disappears afterwards
      rerender(
        <BottomSheet visible={false}>
          <Text>{content}</Text>
        </BottomSheet>,
      )

      await waitFor(() => expect(queryByText(content)).toBeNull())
    })
  })
})
