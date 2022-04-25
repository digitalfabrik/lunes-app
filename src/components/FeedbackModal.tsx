import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import labels from '../constants/labels.json'
import ConfirmationModal from './ConfirmationModal'
import CustomTextInput from './CustomTextInput'

const TextInputContainer = styled.View`
  width: 85%;
  margin-bottom: ${props => props.theme.spacings.xl};
`

interface FeedbackModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, setVisible }: FeedbackModalProps): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const onClose = (): void => {
    setMessage('')
    setEmail('')
    setVisible(false)
  }
  const onSubmit = (): void => {
    // TODO Submit Feedback LUNES-269
    onClose()
  }

  return (
    <ConfirmationModal
      testID='feedbackModal'
      visible={visible}
      onClose={onClose}
      text={labels.feedback.question}
      confirmationButtonText={labels.feedback.sendFeedback}
      confirmationAction={onSubmit}
      confirmationDisabled={message.length === 0}>
      <TextInputContainer>
        <CustomTextInput
          value={message}
          onChangeText={setMessage}
          placeholder={labels.feedback.feedbackPlaceholder}
          lines={5}
          clearable
        />
        <CustomTextInput
          textContentType='emailAddress'
          value={email}
          onChangeText={setEmail}
          placeholder={labels.feedback.mailPlaceholder}
          clearable
        />
      </TextInputContainer>
    </ConfirmationModal>
  )
}

export default FeedbackModal
