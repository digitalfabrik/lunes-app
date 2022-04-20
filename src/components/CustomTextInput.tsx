import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
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

const TextInputContainer = styled.View<{ lines: number; hasError: boolean }>`
  border: 1px solid ${props => (props.hasError ? props.theme.colors.incorrect : props.theme.colors.text)};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  border-radius: 2px;
  height: ${props => (props.lines > 1 ? props.lines * LINE_HEIGHT : MIN_HEIGHT)}px;
  flex-direction: row;
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
}

const IconContainer = styled.View`
  padding-right: ${props => props.theme.spacings.xxs};
`

const ErrorContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xxs};
  min-height: 30px;
`

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  lines = 1,
  clearable = false,
  placeholder,
  textContentType,
  rightContainer,
  errorMessage
}: CustomTextInputProps): ReactElement => {
  const theme = useTheme()

  return (
    <>
      <TextInputContainer lines={lines} hasError={!!(errorMessage && errorMessage.length > 0)}>
        <StyledTextInput
          textContentType={textContentType}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={lines > 1}
          placeholderTextColor={theme.colors.placeholder}
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
      {errorMessage !== undefined && (
        <ErrorContainer>{errorMessage.length > 0 && <ContentError>{errorMessage}</ContentError>}</ErrorContainer>
      )}
    </>
  )
}

export default CustomTextInput
