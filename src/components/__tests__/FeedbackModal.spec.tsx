import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { FeedbackType } from '../../constants/data'
import labels from '../../constants/labels.json'
import { sendFeedback } from '../../services/helpers'
import render from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

jest.mock('../../services/helpers', () => ({
  sendFeedback: jest.fn(() => Promise.resolve()),
}))

describe('FeedbackModal', () => {
  const onClose = jest.fn()

  it('should have a disabled send button when message is empty', () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.document} feedbackForId={1} />
    )
    expect(getByText(labels.feedback.sendFeedback)).toBeDisabled()
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
  })

  it('should get a cleared feedback text when clear button was clicked', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.document} feedbackForId={1} />
    )
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.press(getByTestId('clearInput'))
    expect(feedbackInputField.props.value).toBe('')
  })

  it('should send feedback', () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.document} feedbackForId={1} />
    )
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    const emailInputField = getByPlaceholderText(labels.feedback.mailPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.changeText(emailInputField, 'app-team@lunes.de')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(labels.feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(sendFeedback).toHaveBeenCalledWith('Mein Feedback app-team@lunes.de', FeedbackType.document, 1)
  })
})
