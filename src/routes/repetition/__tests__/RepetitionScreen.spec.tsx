import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { RepetitionService } from '../../../services/RepetitionService'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import RepetitionScreen from '../RepetitionScreen'

jest.mock('victory-native')
jest.mock('@react-navigation/native')

describe('RepetitionScreen', () => {
  const navigation = createNavigationMock<'Repetition'>()
  RepetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound = jest.fn()

  it('should render screen correctly', async () => {
    mocked(RepetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound).mockImplementation(() =>
      Promise.resolve(2),
    )
    const { getByText, getByTestId } = render(<RepetitionScreen navigation={navigation} />)
    await waitFor(() => expect(getByText(`2 ${getLabels().repetition.wordsToRepeat.plural}`)).toBeDefined())
    expect(getByTestId('info-circle-black-icon')).toBeDefined()
    expect(getByText(getLabels().repetition.repeatNow)).toBeDefined()
  })

  it('should open modal on icon click', async () => {
    const { getByTestId, queryByTestId } = render(<RepetitionScreen navigation={navigation} />)
    const isInfoIconPressed = getByTestId('info-circle-black-icon')
    expect(isInfoIconPressed).toBeDefined()
    expect(queryByTestId('infoModal')).toBeFalsy()
    fireEvent.press(isInfoIconPressed)
    expect(getByTestId('infoModal')).toBeTruthy()
    expect(getByTestId('infoModal').props.visible).toBe(true)
  })
})
