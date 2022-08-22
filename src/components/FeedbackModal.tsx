import React, { ReactElement, useState, FC } from 'react'
import styled from 'styled-components/native'

import { FeedbackType } from '../constants/data'
import labels from '../constants/labels.json'
import { sendFeedback } from '../services/helpers'
import { reportError } from '../services/sentry'
import CustomTextInput from './CustomTextInput'
import Modal from './Modal'

const TextInputContainer = styled.View`
  width: 85%;
  margin-bottom: ${props => props.theme.spacings.xl};
`

interface FeedbackModalProps {
  visible: boolean
  onClose: () => void
  feedbackType: FeedbackType
  feedbackForId: number
}

const FeedbackModal: FC<FeedbackModalProps> = ({
  visible,
  onClose,
  feedbackType,
  feedbackForId,
}: FeedbackModalProps): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const onCloseFeedback = (): void => {
    setMessage('')
    setEmail('')
    onClose()
  }
  const onSubmit = (): void => {
    sendFeedback(`${message} ${email}`, feedbackType, feedbackForId).catch(reportError).finally(onCloseFeedback)
  }

  return (
    <Modal
      testID='feedbackModal'
      visible={visible}
      onClose={onCloseFeedback}
      text={labels.feedback.question}
      showCancelButton={false}
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
    </Modal>
  )
}

export default FeedbackModal
