import { fireEvent, waitFor, act } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { SIMPLE_RESULTS } from '../../constants/data'
import { useLoadAsync } from '../../hooks/useLoadAsync'
import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import CheatMode from '../CheatMode'

jest.mock('../../hooks/useLoadAsync', () => ({
  useLoadAsync: jest.fn(),
}))

const cheat = jest.fn()

describe('CheatMode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not show cheat buttons in normal mode', async () => {
    mocked<typeof useLoadAsync<boolean, never>>(useLoadAsync).mockImplementation(() => ({
      data: false,
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByText } = render(<CheatMode cheat={cheat} />)

    await waitFor(() => expect(queryByText(getLabels().exercises.cheat.succeed)).toBeNull())
    await waitFor(() => expect(queryByText(getLabels().exercises.cheat.fail)).toBeNull())
  })

  it("should call parent's cheat function with proper result type", async () => {
    mocked<typeof useLoadAsync<boolean, never>>(useLoadAsync).mockImplementation(() => ({
      data: true,
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { findByText } = render(<CheatMode cheat={cheat} />)

    const succeedButton = await findByText(getLabels().exercises.cheat.succeed)
    act(() => fireEvent.press(succeedButton))
    expect(cheat).toHaveBeenCalledWith(SIMPLE_RESULTS.correct)

    cheat.mockClear()

    const failButton = await findByText(getLabels().exercises.cheat.fail)
    act(() => fireEvent.press(failButton))
    expect(cheat).toHaveBeenCalledWith(SIMPLE_RESULTS.incorrect)
  })
})
