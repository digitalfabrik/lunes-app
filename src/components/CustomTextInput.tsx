import React, { ReactElement, useState } from 'react'
import { TextInputProps } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import theme from '../constants/theme'
import PressableOpacity from './PressableOpacity'
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

const ClearContainer = styled(PressableOpacity)`
  width: ${wp('6%')}px;
  height: ${wp('6%')}px;
`

const TextInputContainer = styled.View<{ lines: number; borderColor: string; showErrorValidation: boolean }>`
  border: 1px solid ${props => props.borderColor};
  padding: 0 ${props => props.theme.spacings.sm};
  border-radius: 2px;
  height: ${props => (props.lines > 1 ? props.lines * LINE_HEIGHT : MIN_HEIGHT)}px;
  flex-direction: row;
  margin-bottom: ${props => (props.showErrorValidation ? 0 : props.theme.spacings.xs)};
`

const IconContainer = styled.View<{ multiLine: boolean }>`
  align-self: ${props => (props.multiLine ? 'flex-start' : 'center')};
  padding: ${props => props.theme.spacings.xs} 0;
`

const ErrorContainer = styled.View`
  min-height: ${props => props.theme.spacings.lg};
`

interface CustomTextInputProps extends TextInputProps {
  value: string
  onChangeText: (value: string) => void
  lines?: number
  clearable?: boolean
  rightContainer?: ReactElement
  errorMessage?: string
  customBorderColor?: string
}

const getBorderColor = (hasErrorMessage: boolean, isFocused: boolean): string => {
  if (hasErrorMessage) {
    return theme.colors.incorrect
  }
  return isFocused ? theme.colors.primary : theme.colors.textSecondary
}

const CustomTextInput = ({
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
  customBorderColor,
}: CustomTextInputProps): ReactElement => {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const showErrorValidation = errorMessage !== undefined
  const multiLine = lines > 1

  return (
    <>
      <TextInputContainer
        lines={lines}
        borderColor={customBorderColor ?? getBorderColor(!!(showErrorValidation && errorMessage.length > 0), isFocused)}
        showErrorValidation={showErrorValidation}>
        <StyledTextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textContentType={textContentType}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiLine}
          placeholderTextColor={theme.colors.placeholder}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
          textAlignVertical={multiLine ? 'top' : 'center'}
        />
        <IconContainer multiLine={multiLine}>
          {clearable && value.length > 0 ? (
            <ClearContainer onPress={() => onChangeText('')} testID='clearInput'>
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
