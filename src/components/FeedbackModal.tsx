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
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, setIsVisible }: FeedbackModalProps): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const onSubmit = (): void => {
    // TODO send information Rename ConfirmationModel, adjust and add tests, add JiraTicketNr for send information
    // TODO a11y https://www.hingehealth.com/engineering-blog/accessible-react-native-textinput/
    setIsVisible(false)
    setMessage('')
    setEmail('')
  }
  return (
    <ConfirmationModal
      visible={isVisible}
      setVisible={setIsVisible}
      text={labels.feedback.question}
      confirmationButtonText={labels.feedback.sendFeedback}
      confirmationAction={onSubmit}>
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
