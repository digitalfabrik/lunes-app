import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../services/helpers'
import render from '../../../testing/render'
import RepetitionScreen from '../RepetitionScreen'

describe('RepetitionScreen', () => {
  const setVisible = jest.fn()

  it('should render screen correctly', () => {
    const { getByText, getByTestId } = render(<RepetitionScreen />)
    const isHeader = getByText(getLabels().repetition.wordsToRepeat)
    const isInfoIcon = getByTestId('info-circle-black-icon')
    const isButtonLabel = getByText(getLabels().repetition.repeatNow)
    expect(isHeader).toBeTruthy()
    expect(isButtonLabel).toBeTruthy()
    expect(isInfoIcon).toBeDefined()
  })

  it('should open modal on icon click', () => {
    const { getByTestId } = render(<RepetitionScreen />)
    const isInfoIconPressed = getByTestId('info-circle-black-icon')
    expect(isInfoIconPressed).toBeDefined()
    fireEvent.press(isInfoIconPressed)
    expect(setVisible).toBeTruthy()
  })
})
