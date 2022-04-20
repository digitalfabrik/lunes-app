import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import ConfirmationModal from './ConfirmationModal'

const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.primary};
  border: 1px solid ${prop => prop.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacings.sm};
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.md};
  border-radius: 2px;
`

const StyledTextArea = styled(StyledTextInput)`
  height: 150px;
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
  z-index: 1;
`

const TextInputContainer = styled.View`
  width: 90%;
  padding: ${props => `0 ${props.theme.spacings.sm}`};
  margin-bottom: ${props => props.theme.spacings.sm};
`

interface FeedbackModalProps {
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, setIsVisible }: FeedbackModalProps): ReactElement => {
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const theme = useTheme()
  const onSubmit = (): void => {
    // TODO send information
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
        <View>
          <Icon onPress={() => setMessage('')}>
            <CloseIcon width={wp('6%')} height={wp('6%')} />
          </Icon>
          <StyledTextArea
            value={message}
            onChangeText={setMessage}
            placeholder={labels.feedback.feedbackPlaceholder}
            multiline
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
        <StyledTextInput
          textContentType='emailAddress'
          value={email}
          onChangeText={setEmail}
          placeholder={labels.feedback.mailPlaceholder}
          placeholderTextColor={theme.colors.placeholder}
        />
      </TextInputContainer>
    </ConfirmationModal>
  )
}

export default FeedbackModal
