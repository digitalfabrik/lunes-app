import React, { useState, ReactElement } from 'react'
import { TouchableOpacity, Pressable, Keyboard } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import stringSimilarity from 'string-similarity'
import styled from 'styled-components/native'

import { CloseIcon } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import ImageCarousel from '../../../components/ImageCarousel'
import { numberOfMaxRetries, SIMPLE_RESULTS, SimpleResultType } from '../../../constants/data'
import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { COLORS } from '../../../constants/theme/colors'
import { DocumentResultType } from '../../../navigation/NavigationTypes'
import { stringifyDocument } from '../../../services/helpers'
import Actions from './Actions'
import ArticleMissingPopoverContent from './ArticleMissingPopoverContent'
import Feedback from './FeedbackSection'
import Popover from './Popover'

const StyledContainer = styled.View`
  padding-top: 20px;
  padding-bottom: 30px;
  align-items: center;
  position: relative;
  width: 100%;
  height: 85%;
`
const TextInputContainer = styled.View<{ styledBorderColor: string }>`
  width: 80%;
  height: ${hp('8%')}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-radius: 2px;
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: 5%;
  border-color: ${prop => prop.styledBorderColor};
`
const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.lunesBlack};
  width: 90%;
`

export interface AnswerSectionPropsType {
  tryLater: () => void
  currentDocumentNumber: number
  setCurrentDocumentNumber: (currentDocumentNumber: number) => void
  documents: DocumentType[]
  finishExercise: (results: DocumentResultType[]) => void
}

const almostCorrectThreshold = 0.6
const ttsThreshold = 0.6

const WriteExercise = ({
  currentDocumentNumber,
  setCurrentDocumentNumber,
  finishExercise,
  tryLater,
  documents
}: AnswerSectionPropsType): ReactElement => {
  const [isArticleMissing, setIsArticleMissing] = useState<boolean>(false)
  // The currently entered answer
  const [input, setInput] = useState<string>('')
  // The last submitted answer
  const [submission, setSubmission] = useState<string | null>(null)
  // The result of the lastly submitted answer
  const [result, setResult] = useState<SimpleResultType | null>(null)
  // The results of all previous documents
  const [results, setResults] = useState<DocumentResultType[]>([])
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const touchable: any = React.createRef()

  const document = documents[currentDocumentNumber]
  const secondAttempt = !!submission

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const checkEntry = async (): Promise<void> => {
    const splitInput = input.trim().split(' ')

    if (splitInput.length < 2) {
      setIsArticleMissing(true)
      return
    }

    setSubmission(input)
    setIsArticleMissing(false)

    const article = capitalizeFirstLetter(splitInput[0])
    const word = splitInput[1]

    const newResult = validateAnswer(article, word)
    setResult(newResult)

    storeResult(newResult)
  }

  const validateAnswer = (article: string, word: string): SimpleResultType => {
    const validAnswers = [{ article: document.article, word: document.word }, ...document.alternatives]
    if (validAnswers.some(answer => answer.word === word && answer.article.value === article)) {
      // Article and word are an exact match with either the document or an alternative
      return 'correct'
    } else if (validAnswers.some(answer => answer.word === word)) {
      // Word is an exact match with either the document or an alternative -> just the article is wrong
      return 'similar'
    } else if (
      validAnswers.some(answer => stringSimilarity.compareTwoStrings(answer.word, word) > almostCorrectThreshold)
    ) {
      return 'similar'
    }

    return 'incorrect'
  }

  const giveUp = async (): Promise<void> => {
    const previousResult = result
    setResult('incorrect')
    storeResult(previousResult ?? 'incorrect', true)
  }

  const continueExercise = (): void => {
    setResult(null)
    setSubmission(null)
    setInput('')

    if (currentDocumentNumber === documents.length - 1 && !getRetryInfoOfCurrent().needsToBeRepeated) {
      finishExercise(results)
    } else {
      getRetryInfoOfCurrent().needsToBeRepeated ? tryLater() : setCurrentDocumentNumber(currentDocumentNumber + 1)
    }
  }

  const storeResult = (score: SimpleResultType, noFurtherRetries: boolean = false): void => {
    const nthRetry = noFurtherRetries ? numberOfMaxRetries : getRetryInfoOfCurrent().nthRetry

    const indexOfCurrentResult = results.findIndex(result => result.id === document?.id)
    const result: DocumentResultType = { ...document, result: score, numberOfTries: nthRetry + 1 }
    const newArr = results
    if (indexOfCurrentResult !== -1) {
      newArr[indexOfCurrentResult] = result
      if (results[indexOfCurrentResult].result === 'similar') {
        newArr[indexOfCurrentResult] = {
          ...document,
          result: nthRetry >= numberOfMaxRetries - 1 ? 'incorrect' : 'similar',
          numberOfTries: nthRetry + 1
        }
      }
      setResult(newArr[indexOfCurrentResult].result)
      setResults(newArr)
    } else {
      setResults([...results, result])
    }
  }

  const getRetryInfoOfCurrent = (): { nthRetry: number; needsToBeRepeated: boolean } => {
    const indexOfCurrent = results.findIndex(result => result.id === document?.id)
    const nthRetry = indexOfCurrent === -1 ? 0 : results[indexOfCurrent].numberOfTries
    const needsToBeRepeated =
      nthRetry < numberOfMaxRetries &&
      (indexOfCurrent === -1 || results[indexOfCurrent].result !== SIMPLE_RESULTS.correct)
    return { nthRetry, needsToBeRepeated }
  }

  const getBorderColor = (): string => {
    if (isFocused) {
      return COLORS.lunesBlack
    } else if (!secondAttempt && !input) {
      return COLORS.lunesGreyMedium
    } else if (!result && !secondAttempt) {
      return COLORS.lunesBlack
    } else if (result === 'correct') {
      return COLORS.lunesFunctionalCorrectDark
    } else if (result === 'incorrect' || !secondAttempt) {
      return COLORS.lunesFunctionalIncorrectDark
    } else {
      return COLORS.lunesFunctionalAlmostCorrectDark
    }
  }

  const editable = result === null || result === 'similar'
  const correctAlternativeSubmitted =
    result === 'correct' &&
    submission &&
    stringSimilarity.compareTwoStrings(submission, stringifyDocument(document)) <= ttsThreshold
  const submittedAlternative = correctAlternativeSubmitted ? submission : null

  return (
    <>
      <ImageCarousel images={document.document_image} />
      <AudioPlayer
        document={document}
        disabled={!result || result === 'similar'}
        submittedAlternative={submittedAlternative}
      />

      <Pressable onPress={Keyboard.dismiss}>
        <StyledContainer>
          <Popover isVisible={isArticleMissing} setIsPopoverVisible={setIsArticleMissing} ref={touchable}>
            <ArticleMissingPopoverContent />
          </Popover>

          <TextInputContainer testID='input-field' ref={touchable} styledBorderColor={getBorderColor()}>
            <StyledTextInput
              placeholder={secondAttempt ? labels.exercises.write.newTry : labels.exercises.write.insertAnswer}
              placeholderTextColor={COLORS.lunesBlackLight}
              value={input}
              onChangeText={setInput}
              editable={editable}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmitEditing={checkEntry}
            />
            {editable && input !== '' && (
              <TouchableOpacity onPress={() => setInput('')}>
                <CloseIcon />
              </TouchableOpacity>
            )}
          </TextInputContainer>

          {result && (
            <Feedback
              result={result}
              document={document}
              submission={submission}
              needsToBeRepeated={getRetryInfoOfCurrent().needsToBeRepeated}
            />
          )}

          <Actions
            tryLater={tryLater}
            giveUp={giveUp}
            input={input}
            result={result}
            checkEntry={checkEntry}
            continueExercise={continueExercise}
            isFinished={currentDocumentNumber === documents.length - 1}
            needsToBeRepeated={getRetryInfoOfCurrent().needsToBeRepeated}
          />
        </StyledContainer>
      </Pressable>
    </>
  )
}

export default WriteExercise
