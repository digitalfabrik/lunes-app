import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { VocabularyItemTypes } from '../../models/VocabularyItem'
import { postFeedback } from '../../services/CmsApi'
import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

jest.mock('../../services/CmsApi', () => ({
  ...jest.requireActual('../../services/CmsApi'),
  postFeedback: jest.fn(() => Promise.resolve()),
}))

describe('FeedbackModal', () => {
  const onClose = jest.fn()

  it('should have a disabled send button when message is empty', () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal
        visible
        onClose={onClose}
        feedbackTarget={{ type: 'word', wordId: { id: 1, type: VocabularyItemTypes.Standard } }}
      />,
    )
    expect(getByText(getLabels().feedback.sendFeedback)).toBeDisabled()
    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    expect(getByText(getLabels().feedback.sendFeedback)).toBeEnabled()
  })

  it('should get a cleared feedback text when clear button was clicked', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <FeedbackModal
        visible
        onClose={onClose}
        feedbackTarget={{ type: 'word', wordId: { id: 1, type: VocabularyItemTypes.Standard } }}
      />,
    )
    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.press(getByTestId('clearInput'))
    expect(feedbackInputField.props.value).toBe('')
  })

  it('should send feedback', async () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal
        visible
        onClose={onClose}
        feedbackTarget={{ type: 'word', wordId: { id: 1, type: VocabularyItemTypes.Standard } }}
      />,
    )

    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    const emailInputField = getByPlaceholderText(getLabels().feedback.mailPlaceholder)

    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.changeText(emailInputField, 'app-team@lunes.de')

    expect(getByText(getLabels().feedback.sendFeedback)).toBeEnabled()

    const submitButton = getByText(getLabels().feedback.sendFeedback)
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(postFeedback).toHaveBeenCalledWith({
        comment: 'Mein Feedback app-team@lunes.de',
        target: { type: 'word', wordId: { id: 1, type: VocabularyItemTypes.Standard } },
      })
    })

    await waitFor(() => {
      expect(feedbackInputField.props.value).toBe('')
      expect(emailInputField.props.value).toBe('')
    })
  })
})
