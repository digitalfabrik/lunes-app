import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { SCORE_THRESHOLD_POSITIVE_FEEDBACK, FEEDBACK } from '../../constants/data'
import { useLoadAsync } from '../../hooks/useLoadAsync'
import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import FeedbackBadge from '../FeedbackBadge'

jest.mock('../../hooks/useLoadAsync', () => ({
  useLoadAsync: jest.fn(),
}))

const mockSetFeedback = jest.fn()

describe('FeedbackBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const renderFeedbackBadge = (levelIdentifier: { disciplineId: number; level: number } | null) =>
    render(
      <FeedbackBadge
        levelIdentifier={
          levelIdentifier ? { disciplineId: levelIdentifier.disciplineId, level: levelIdentifier.level } : null
        }
        setFeedback={mockSetFeedback}
      />
    )

  it('should not show when no level info is provided', async () => {
    mocked(useLoadAsync).mockImplementation(() => ({
      data: {},
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByTestId } = renderFeedbackBadge(null)

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })

  it('should not show when level is not done', async () => {
    mocked(useLoadAsync).mockImplementation(() => ({
      data: { '0': { '1': undefined } },
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByTestId } = renderFeedbackBadge({ disciplineId: 0, level: 1 })

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })

  it('should not show for wordlist level', async () => {
    mocked(useLoadAsync).mockImplementation(() => ({
      data: { '0': { '0': SCORE_THRESHOLD_POSITIVE_FEEDBACK + 1 } },
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByTestId } = renderFeedbackBadge({ disciplineId: 0, level: 0 })

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })

  it('should show positive feedback for scores above threshold', async () => {
    mocked(useLoadAsync).mockImplementation(() => ({
      data: { '0': { '1': SCORE_THRESHOLD_POSITIVE_FEEDBACK + 1 } },
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByText, queryByTestId } = renderFeedbackBadge({ disciplineId: 0, level: 1 })

    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('positive-badge')).not.toBeNull())
    await waitFor(() => expect(queryByText(getLabels().exercises.feedback.positive)).not.toBeNull())
    await waitFor(() => expect(mockSetFeedback).toHaveBeenCalledWith(FEEDBACK.POSITIVE))
  })

  it('should show negative feedback for scores below threshold', async () => {
    mocked(useLoadAsync).mockImplementation(() => ({
      data: { '0': { '1': SCORE_THRESHOLD_POSITIVE_FEEDBACK - 1 } },
      error: null,
      loading: false,
      refresh: () => null,
    }))
    const { queryByText, queryByTestId } = renderFeedbackBadge({ disciplineId: 0, level: 1 })

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).not.toBeNull())
    await waitFor(() => expect(queryByText(getLabels().exercises.feedback.negative)).not.toBeNull())
    await waitFor(() => expect(mockSetFeedback).toHaveBeenCalledWith(FEEDBACK.NEGATIVE))
  })
})
