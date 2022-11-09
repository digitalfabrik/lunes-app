import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { FeedbackType } from '../../constants/data'
import { getLabels, sendFeedback } from '../../services/helpers'
import render from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

jest.mock('../../services/helpers', () => ({
  ...jest.requireActual('../../services/helpers'),
  sendFeedback: jest.fn(() => Promise.resolve()),
}))

describe('FeedbackModal', () => {
  const onClose = jest.fn()

  it('should have a disabled send button when message is empty', () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.vocabularyItem} feedbackForId={1} />
    )
    expect(getByText(getLabels().feedback.sendFeedback)).toBeDisabled()
    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    expect(getByText(getLabels().feedback.sendFeedback)).toBeEnabled()
  })

  it('should get a cleared feedback text when clear button was clicked', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.vocabularyItem} feedbackForId={1} />
    )
    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.press(getByTestId('clearInput'))
    expect(feedbackInputField.props.value).toBe('')
  })

  it('should send feedback', () => {
    const { getByText, getByPlaceholderText } = render(
      <FeedbackModal visible onClose={onClose} feedbackType={FeedbackType.vocabularyItem} feedbackForId={1} />
    )
    const feedbackInputField = getByPlaceholderText(getLabels().feedback.feedbackPlaceholder)
    const emailInputField = getByPlaceholderText(getLabels().feedback.mailPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.changeText(emailInputField, 'app-team@lunes.de')
    expect(getByText(getLabels().feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(getLabels().feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(sendFeedback).toHaveBeenCalledWith('Mein Feedback app-team@lunes.de', FeedbackType.vocabularyItem, 1)
  })
})
