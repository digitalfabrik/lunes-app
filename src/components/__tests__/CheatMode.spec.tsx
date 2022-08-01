import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { SIMPLE_RESULTS } from '../../constants/data'
import labels from '../../constants/labels.json'
import { getDevMode } from '../../services/AsyncStorage'
import render from '../../testing/render'
import CheatMode from '../CheatMode'

jest.mock('../../services/AsyncStorage', () => ({
  getDevMode: jest.fn(),
}))

const cheatFunc = jest.fn()

describe('CheatMode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not show cheat buttons in normal mode', async () => {
    ;(getDevMode as jest.Mock).mockImplementation(async () => false)
    const { queryByText } = render(<CheatMode cheatFunc={cheatFunc} />)

    await waitFor(() => expect(queryByText(labels.exercises.cheat.succeed)).toBeNull())
    await waitFor(() => expect(queryByText(labels.exercises.cheat.fail)).toBeNull())
  })

  it('should show cheat buttons in dev mode', async () => {
    ;(getDevMode as jest.Mock).mockImplementation(async () => true)
    const { getByText } = render(<CheatMode cheatFunc={cheatFunc} />)

    await waitFor(() => expect(getByText(labels.exercises.cheat.succeed)).not.toBeNull())
    await waitFor(() => expect(getByText(labels.exercises.cheat.fail)).not.toBeNull())
  })

  it("should call parent's cheat function with proper result type", async () => {
    ;(getDevMode as jest.Mock).mockImplementation(async () => true)
    const { findByText } = render(<CheatMode cheatFunc={cheatFunc} />)

    const succeedButton = await findByText(labels.exercises.cheat.succeed)
    fireEvent.press(succeedButton)
    expect(cheatFunc).toHaveBeenCalledWith(SIMPLE_RESULTS.correct)

    cheatFunc.mockClear()

    const failButton = await findByText(labels.exercises.cheat.fail)
    fireEvent.press(failButton)
    expect(cheatFunc).toHaveBeenCalledWith(SIMPLE_RESULTS.incorrect)
  })
})
