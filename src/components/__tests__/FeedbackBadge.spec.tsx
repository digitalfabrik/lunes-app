import { waitFor } from '@testing-library/react-native'
import React from 'react'

import { SCORE_THRESHOLD_POSITIVE_FEEDBACK, EXERCISE_FEEDBACK } from '../../constants/data'
import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import FeedbackBadge from '../FeedbackBadge'

describe('FeedbackBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderFeedbackBadge = (feedback: EXERCISE_FEEDBACK) => render(<FeedbackBadge feedback={feedback} />)

  it('should not show badge for no feedback', async () => {
    const { queryByTestId } = renderFeedbackBadge(EXERCISE_FEEDBACK.NONE)

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })

  it('should show badge for positive feedback', async () => {
    const { queryByText, queryByTestId } = renderFeedbackBadge(EXERCISE_FEEDBACK.POSITIVE)

    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('positive-badge')).not.toBeNull())
    await waitFor(() => expect(queryByText(getLabels().exercises.feedback.positive)).not.toBeNull())
  })

  it('should show badge for negative feedback', async () => {
    const { queryByText, queryByTestId } = renderFeedbackBadge(EXERCISE_FEEDBACK.NEGATIVE)

    await waitFor(() => expect(queryByTestId('positive-badge')).toBeNull())
    await waitFor(() => expect(queryByTestId('negative-badge')).not.toBeNull())
    await waitFor(() => expect(queryByText(getLabels().exercises.feedback.negative)).not.toBeNull())
  })
})
