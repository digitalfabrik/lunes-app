import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { FeedbackTarget } from '../constants/data'
import { getLabels, sendFeedback } from '../services/helpers'
import { reportError } from '../services/sentry'
import CustomTextInput from './CustomTextInput'
import Modal from './Modal'

const TextInputContainer = styled.View`
  width: 85%;
  margin-bottom: ${props => props.theme.spacings.xl};
`

type FeedbackModalProps = {
  visible: boolean
  onClose: () => void
  feedbackFor: FeedbackTarget
}

const FeedbackModal = ({ visible, onClose, feedbackFor }: FeedbackModalProps): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const onCloseFeedback = (): void => {
    setMessage('')
    setEmail('')
    onClose()
  }
  const onSubmit = (): void => {
    sendFeedback(`${message} ${email}`, feedbackFor).catch(reportError).finally(onCloseFeedback)
  }

  return (
    <Modal
      testID='feedbackModal'
      visible={visible}
      onClose={onCloseFeedback}
      text={getLabels().feedback.question}
      showCancelButton={false}
      confirmationButtonText={getLabels().feedback.sendFeedback}
      confirmationAction={onSubmit}
      confirmationDisabled={message.length === 0}>
      <TextInputContainer>
        <CustomTextInput
          value={message}
          onChangeText={setMessage}
          placeholder={getLabels().feedback.feedbackPlaceholder}
          lines={3}
          clearable
        />
        <CustomTextInput
          textContentType='emailAddress'
          value={email}
          onChangeText={setEmail}
          placeholder={getLabels().feedback.mailPlaceholder}
          clearable
        />
      </TextInputContainer>
    </Modal>
  )
}

export default FeedbackModal
