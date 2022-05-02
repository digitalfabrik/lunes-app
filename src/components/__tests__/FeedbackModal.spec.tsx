import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import render from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

describe('FeedbackModal', () => {
  const setVisible = jest.fn()

  it('Button should be disabled for empty message', () => {
    const { getByText, getByPlaceholderText } = render(<FeedbackModal visible setVisible={setVisible} />)
    expect(getByText(labels.feedback.sendFeedback)).toBeDisabled()
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(labels.feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(setVisible).toHaveBeenCalledWith(false)
  })

  it('Clears feedback text by clicking clear button', () => {
    const { getByPlaceholderText, getByTestId } = render(<FeedbackModal visible setVisible={setVisible} />)
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.press(getByTestId('clearInput'))
    expect(feedbackInputField.props.value).toBe('')
  })

  it('Clears input fields after sending feedback', () => {
    const { getByText, getByPlaceholderText } = render(<FeedbackModal visible setVisible={setVisible} />)
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    const emailInputField = getByPlaceholderText(labels.feedback.mailPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.changeText(emailInputField, 'app-team@lunes.de')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(labels.feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(feedbackInputField.props.value).toBe('')
    expect(emailInputField.props.value).toBe('')
  })
})
