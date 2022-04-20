import React, { ReactElement, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import theme from '../constants/theme'
import { ContentError } from './text/Content'

const LINE_HEIGHT = 30
const MIN_HEIGHT = 60

const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.primary};
  flex: 1;
`

const ClearContainer = styled.TouchableOpacity`
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`

const TextInputContainer = styled.View<{ lines: number; borderColor: string; showErrorValidation: boolean }>`
  border: 1px solid ${props => props.borderColor};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  border-radius: 2px;
  height: ${props => (props.lines > 1 ? props.lines * LINE_HEIGHT : MIN_HEIGHT)}px;
  flex-direction: row;
  margin-bottom: ${props => (props.showErrorValidation ? 0 : props.theme.spacings.xs)};
`

const IconContainer = styled.View`
  padding-right: ${props => props.theme.spacings.xxs};
`

const ErrorContainer = styled.View`
  min-height: ${props => props.theme.spacings.lg};
`

interface CustomTextInputProps {
  value: string
  onChangeText: (value: string) => void
  /** calculates the height for textArea */
  lines?: number
  /** shows clear indicator if set & input set */
  clearable?: boolean
  placeholder?: string
  /** check React Native TextInput for more types */
  textContentType?: 'emailAddress'
  rightContainer?: ReactElement
  /** Shows error message below the text input. Empty string provides a placeholder */
  errorMessage?: string
  onSubmitEditing?: () => void
  editable?: boolean
  /** Custom border color can be defined */
  customBorderColor?: string
}

// depending on error and focus the border color will be defined
const getBorderColor = (hasErrorMessage: boolean, isFocused: boolean): string => {
  if (hasErrorMessage) {
    return theme.colors.incorrect
  }
  return isFocused ? theme.colors.primary : theme.colors.textSecondary
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  lines = 1,
  clearable = false,
  placeholder,
  textContentType,
  rightContainer,
  errorMessage,
  editable = true,
  onSubmitEditing,
  customBorderColor
}: CustomTextInputProps): ReactElement => {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const hasErrorMessage = !!(errorMessage && errorMessage.length > 0)
  const showErrorValidation = errorMessage !== undefined

  return (
    <>
      <TextInputContainer
        lines={lines}
        borderColor={customBorderColor ?? getBorderColor(hasErrorMessage, isFocused)}
        showErrorValidation={showErrorValidation}>
        <StyledTextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textContentType={textContentType}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={lines > 1}
          placeholderTextColor={theme.colors.placeholder}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
        />
        <IconContainer>
          {clearable && value.length > 0 ? (
            <ClearContainer onPress={() => onChangeText('')}>
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            </ClearContainer>
          ) : (
            rightContainer
          )}
        </IconContainer>
      </TextInputContainer>
      {showErrorValidation && (
        <ErrorContainer>{errorMessage.length > 0 && <ContentError>{errorMessage}</ContentError>}</ErrorContainer>
      )}
    </>
  )
}

export default CustomTextInput
