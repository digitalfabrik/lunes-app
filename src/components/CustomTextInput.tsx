import React, { ReactElement, useState } from 'react'
import { StyleProp, TextInputProps, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon, InfoCircleIcon } from '../../assets/images'
import { getLabels } from '../services/helpers'
import PressableOpacity from './PressableOpacity'
import { ContentError } from './text/Content'
import { HintSecondary } from './text/Hint'

const LINE_HEIGHT = 32
const MIN_HEIGHT = 56

const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.primary};
  flex: 1;
`

const ClearContainer = styled(PressableOpacity)`
  width: ${props => props.theme.spacings.md};
  height: ${props => props.theme.spacings.md};
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

const FooterContainer = styled.View`
  flex-direction: row;
  margin-top: ${props => props.theme.spacings.xs};
`

const ErrorRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
  margin-top: ${props => props.theme.spacings.xs};
  min-height: ${props => props.theme.spacings.lg};
`

const ErrorText = styled(ContentError)`
  flex: 1;
`

const HintText = styled(HintSecondary)`
  flex: 1;
`

const CharacterCount = styled(HintSecondary)<{ isAtLimit: boolean }>`
  margin-left: auto;
  ${props => props.isAtLimit && `color: ${props.theme.colors.incorrect};`}
`

// Enforced here rather than through native maxLength, which counts code units and so an emoji twice
const countCodePoints = (text: string): number => [...text].length

const truncateToCodePointLimit = (text: string, limit: number): string => [...text].slice(0, limit).join('')

const characterCountDescription = (count: number, limit: number): string =>
  getLabels().general.characterCount.replace('{{count}}', count.toString()).replace('{{limit}}', limit.toString())

type CustomTextInputProps = {
  value: string
  onChangeText: (value: string) => void
  lines?: number
  clearable?: boolean
  rightContainer?: ReactElement
  errorMessage?: string
  customBorderColor?: string
  style?: StyleProp<ViewStyle>
  characterLimit?: number
  hint?: string
} & TextInputProps

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
  style,
  characterLimit,
  hint,
}: CustomTextInputProps): ReactElement => {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const showErrorValidation = errorMessage !== undefined
  const hasCharacterLimit = characterLimit !== undefined
  const multiLine = lines > 1
  const characterCount = hasCharacterLimit ? countCodePoints(value) : 0
  const errorText = showErrorValidation && errorMessage.length > 0 ? errorMessage : undefined

  const changeText = (text: string): void => {
    if (characterLimit === undefined) {
      onChangeText(text)
      return
    }
    const isWithinLimit = text.length <= characterLimit
    onChangeText(isWithinLimit ? text : truncateToCodePointLimit(text, characterLimit))
  }

  const getBorderColor = (): string => {
    if (errorText !== undefined) {
      return theme.colors.incorrect
    }
    return isFocused ? theme.colors.primary : theme.colors.textSecondary
  }

  const showFooter = hasCharacterLimit || hint !== undefined

  return (
    <>
      <TextInputContainer
        style={style}
        lines={lines}
        borderColor={customBorderColor ?? getBorderColor()}
        showErrorValidation={showErrorValidation}
      >
        <StyledTextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textContentType={textContentType}
          value={value}
          onChangeText={changeText}
          placeholder={placeholder}
          multiline={multiLine}
          placeholderTextColor={theme.colors.placeholder}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
          textAlignVertical={multiLine ? 'top' : 'center'}
        />
        <IconContainer multiLine={multiLine}>
          {clearable && value.length > 0 ? (
            <ClearContainer onPress={() => changeText('')} testID='clearInput'>
              <CloseIcon width={theme.spacingsPlain.md} height={theme.spacingsPlain.md} color={theme.colors.primary} />
            </ClearContainer>
          ) : (
            rightContainer
          )}
        </IconContainer>
      </TextInputContainer>
      {showFooter && (
        <FooterContainer>
          {hint !== undefined && <HintText>{hint}</HintText>}
          {hasCharacterLimit && (
            <CharacterCount
              isAtLimit={characterCount >= characterLimit}
              accessibilityLabel={characterCountDescription(characterCount, characterLimit)}
            >
              {`${characterCount} / ${characterLimit}`}
            </CharacterCount>
          )}
        </FooterContainer>
      )}
      {showErrorValidation && (
        <ErrorRow>
          {errorText !== undefined && (
            <>
              <InfoCircleIcon
                width={theme.spacingsPlain.sm}
                height={theme.spacingsPlain.sm}
                color={theme.colors.incorrect}
              />
              <ErrorText>{errorText}</ErrorText>
            </>
          )}
        </ErrorRow>
      )}
    </>
  )
}

export default CustomTextInput
