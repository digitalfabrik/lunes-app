import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import stringSimilarity from 'string-similarity'
import styled, { useTheme } from 'styled-components/native'

import { CloseIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import DocumentImageSection from '../../../components/DocumentImageSection'
import { BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { useIsKeyboardVisible } from '../../../hooks/useIsKeyboardVisible'
import { DocumentResult } from '../../../navigation/NavigationTypes'
import { stringifyDocument } from '../../../services/helpers'
import Feedback from './Feedback'
import MissingArticlePopover from './MissingArticlePopover'

const TextInputContainer = styled.View<{ styledBorderColor: string }>`
  width: 80%;
  height: ${hp('8%')}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
  padding: ${props => `0 ${props.theme.spacings.sm}`};
  margin-bottom: ${props => props.theme.spacings.sm};
  border: 1px solid ${prop => prop.styledBorderColor};
`
const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.primary};
  width: 90%;
`

const InputContainer = styled.View`
  align-items: center;
  margin-top: ${props => props.theme.spacings.md};
`

interface InteractionSectionProps {
  documentWithResult: DocumentResult
  isAnswerSubmitted: boolean
  storeResult: (result: DocumentResult) => void
}

const almostCorrectThreshold = 0.6
const ttsThreshold = 0.6

const InteractionSection = (props: InteractionSectionProps): ReactElement => {
  const { isAnswerSubmitted, documentWithResult, storeResult } = props
  const { document } = documentWithResult

  const [isArticleMissing, setIsArticleMissing] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [submittedInput, setSubmittedInput] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const theme = useTheme()
  const isKeyboardShown = useIsKeyboardVisible()
  const retryAllowed = !isAnswerSubmitted || documentWithResult.result === 'similar'
  const isCorrect = documentWithResult.result === 'correct'
  const needsToBeRepeated = documentWithResult.numberOfTries < numberOfMaxRetries && !isCorrect
  const isCorrectAlternativeSubmitted =
    isCorrect && stringSimilarity.compareTwoStrings(input, stringifyDocument(document)) <= ttsThreshold
  const submittedAlternative = isCorrectAlternativeSubmitted ? input : null

  const textInputRef = useRef<View>(null)

  useEffect(() => {
    if (!isAnswerSubmitted) {
      setInput('')
    }
  }, [isAnswerSubmitted])

  const validateAnswer = (article: string, word: string): SimpleResult => {
    const validAnswers = [{ article: document.article, word: document.word }, ...document.alternatives]
    if (validAnswers.some(answer => answer.word === word && answer.article.value === article)) {
      return 'correct'
    }
    if (validAnswers.some(answer => answer.word === word)) {
      // Word is an exact match with either the document or an alternative -> just the article is wrong
      return 'similar'
    }
    if (validAnswers.some(answer => stringSimilarity.compareTwoStrings(answer.word, word) > almostCorrectThreshold)) {
      return 'similar'
    }
    return 'incorrect'
  }

  const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

  const updateAndStoreResult = (score: SimpleResult): void => {
    const nthRetry = documentWithResult.numberOfTries + 1
    const documentWithResultToStore = {
      ...documentWithResult,
      result: score === 'similar' && nthRetry >= numberOfMaxRetries ? SIMPLE_RESULTS.incorrect : score,
      numberOfTries: nthRetry
    }
    storeResult(documentWithResultToStore)
  }

  const checkEntry = async (): Promise<void> => {
    const splitInput = input.trim().split(' ')
    if (splitInput.length < 2) {
      setIsArticleMissing(true)
      return
    }

    const article = capitalizeFirstLetter(splitInput[0])
    const word = splitInput[1]

    setSubmittedInput(input)
    updateAndStoreResult(validateAnswer(article, word))
  }

  const getBorderColor = (): string => {
    if (isAnswerSubmitted) {
      switch (documentWithResult.result) {
        case 'correct':
          return theme.colors.correct
        case 'incorrect':
          return theme.colors.incorrect
        case 'similar':
        default:
          return theme.colors.almostCorrect
      }
    }
    return isFocused ? theme.colors.primary : theme.colors.textSecondary
  }

  return (
    <>
      <DocumentImageSection
        document={document}
        minimized={isKeyboardShown}
        audioDisabled={retryAllowed}
        submittedAlternative={submittedAlternative}
      />
      <InputContainer>
        <MissingArticlePopover
          isVisible={isArticleMissing}
          setIsPopoverVisible={setIsArticleMissing}
          ref={textInputRef}
        />

        {/* @ts-expect-error ref typing is off here */}
        <TextInputContainer testID='input-field' ref={textInputRef} styledBorderColor={getBorderColor()}>
          <StyledTextInput
            placeholder={labels.exercises.write.insertAnswer}
            placeholderTextColor={theme.colors.placeholder}
            value={input}
            onChangeText={setInput}
            editable={retryAllowed}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={checkEntry}
          />
          {retryAllowed && input !== '' && (
            <TouchableOpacity onPress={() => setInput('')}>
              <CloseIcon width={wp('6%')} height={wp('6%')} />
            </TouchableOpacity>
          )}
        </TextInputContainer>

        {isAnswerSubmitted && (
          <Feedback
            documentWithResult={documentWithResult}
            submission={submittedInput}
            needsToBeRepeated={needsToBeRepeated}
          />
        )}
        {retryAllowed && (
          <Pressable onPress={Keyboard.dismiss}>
            <Button
              label={labels.exercises.write.checkInput}
              onPress={checkEntry}
              disabled={!input}
              buttonTheme={BUTTONS_THEME.contained}
            />
          </Pressable>
        )}
      </InputContainer>
    </>
  )
}

export default InteractionSection
