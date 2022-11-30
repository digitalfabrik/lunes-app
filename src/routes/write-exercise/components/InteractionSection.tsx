import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import stringSimilarity from 'string-similarity'
import styled, { useTheme } from 'styled-components/native'

import Button from '../../../components/Button'
import CustomTextInput from '../../../components/CustomTextInput'
import VocabularyItemImageSection from '../../../components/VocabularyItemImageSection'
import { BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'
import useKeyboard from '../../../hooks/useKeyboard'
import { VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { getLabels, stringifyVocabularyItem } from '../../../services/helpers'
import Feedback from './Feedback'
import MissingArticlePopover from './MissingArticlePopover'

const TextInputContainer = styled.View<{ styledBorderColor: string }>`
  width: 80%;
  margin-bottom: ${props => props.theme.spacings.md};
`

const InputContainer = styled.View`
  align-items: center;
  margin-top: ${props => props.theme.spacings.md};
`

type InteractionSectionProps = {
  vocabularyItemWithResult: VocabularyItemResult
  isAnswerSubmitted: boolean
  storeResult: (result: VocabularyItemResult) => void
}

const almostCorrectThreshold = 0.6
const ttsThreshold = 0.6

const InteractionSection = (props: InteractionSectionProps): ReactElement => {
  const { isAnswerSubmitted, vocabularyItemWithResult, storeResult } = props
  const { vocabularyItem } = vocabularyItemWithResult

  const [isArticleMissing, setIsArticleMissing] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [submittedInput, setSubmittedInput] = useState<string | null>(null)

  const theme = useTheme()
  const { isKeyboardVisible } = useKeyboard()
  const retryAllowed = !isAnswerSubmitted || vocabularyItemWithResult.result === 'similar'
  const isCorrect = vocabularyItemWithResult.result === 'correct'
  const isCorrectAlternativeSubmitted =
    isCorrect && stringSimilarity.compareTwoStrings(input, stringifyVocabularyItem(vocabularyItem)) <= ttsThreshold
  const submittedAlternative = isCorrectAlternativeSubmitted ? input : null

  const textInputRef = useRef<View>(null)

  useEffect(() => {
    if (!isAnswerSubmitted) {
      setInput('')
      setSubmittedInput('')
    }
  }, [isAnswerSubmitted])

  const validateAnswer = (article: string, word: string): SimpleResult => {
    const validAnswers = [
      { article: vocabularyItem.article, word: vocabularyItem.word },
      ...vocabularyItem.alternatives,
    ]
    if (validAnswers.some(answer => answer.word === word && answer.article.value === article)) {
      return 'correct'
    }
    if (validAnswers.some(answer => answer.word === word)) {
      // Word is an exact match with either the vocabularyItem or an alternative -> just the article is wrong
      return 'similar'
    }
    if (validAnswers.some(answer => stringSimilarity.compareTwoStrings(answer.word, word) > almostCorrectThreshold)) {
      return 'similar'
    }
    return 'incorrect'
  }

  const uncapitalizeFirstLetter = (string: string): string => string.charAt(0).toLowerCase() + string.slice(1)

  const updateAndStoreResult = (score: SimpleResult): void => {
    const nthRetry = vocabularyItemWithResult.numberOfTries + 1
    const vocabularyItemWithResultToStore = {
      ...vocabularyItemWithResult,
      result: score === 'similar' && nthRetry >= numberOfMaxRetries ? SIMPLE_RESULTS.incorrect : score,
      numberOfTries: nthRetry,
    }
    storeResult(vocabularyItemWithResultToStore)
  }

  const checkEntry = async (): Promise<void> => {
    const trimmed = input.trim()
    const indexOfFirstSpace = trimmed.indexOf(' ')
    if (indexOfFirstSpace < 0) {
      setIsArticleMissing(true)
      return
    }

    const article = uncapitalizeFirstLetter(trimmed.substring(0, indexOfFirstSpace))
    const word = trimmed.substring(indexOfFirstSpace + 1)

    setSubmittedInput(input)
    updateAndStoreResult(validateAnswer(article, word))
  }

  const getBorderColor = (): string => {
    if (isAnswerSubmitted) {
      switch (vocabularyItemWithResult.result) {
        case 'correct':
          return theme.colors.correct
        case 'incorrect':
          return theme.colors.incorrect
        case 'similar':
        default:
          return theme.colors.almostCorrect
      }
    }
    return theme.colors.primary
  }

  return (
    <>
      <VocabularyItemImageSection
        vocabularyItem={vocabularyItem}
        minimized={isKeyboardVisible}
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
        <TextInputContainer testID='input-field' ref={textInputRef}>
          <CustomTextInput
            customBorderColor={getBorderColor()}
            placeholder={getLabels().exercises.write.insertAnswer}
            value={input}
            onChangeText={setInput}
            editable={retryAllowed}
            onSubmitEditing={checkEntry}
            clearable={retryAllowed && input !== ''}
          />
        </TextInputContainer>

        {isAnswerSubmitted && (
          <Feedback vocabularyItemWithResult={vocabularyItemWithResult} submission={submittedInput} />
        )}
        {retryAllowed && (
          <Pressable onPress={Keyboard.dismiss}>
            <Button
              label={getLabels().exercises.write.checkInput}
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
