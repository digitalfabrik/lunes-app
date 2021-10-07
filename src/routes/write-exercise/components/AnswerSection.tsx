import React, { useState, ReactElement } from 'react'
import { TouchableOpacity, Pressable, Keyboard } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import stringSimilarity from 'string-similarity'
import styled from 'styled-components/native'

import { CloseIcon } from '../../../../assets/images'
import { ExerciseKeys, SimpleResultType } from '../../../constants/data'
import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { COLORS } from '../../../constants/theme/colors'
import AsyncStorage from '../../../services/AsyncStorage'
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
  font-size: ${wp('4.5%')}px;
  font-weight: normal;
  letter-spacing: 0.11px;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.lunesBlack};
  width: 60%;
`

export interface AnswerSectionPropsType {
  tryLater: () => void
  currentDocumentNumber: number
  setCurrentDocumentNumber: Function
  documents: DocumentType[]
  finishExercise: Function
  trainingSet: string
  disciplineTitle: string
  setHintsEnabled: (hintsEnabled: boolean) => void
}

const almostCorrectThreshold = 0.6

const AnswerSection = ({
  currentDocumentNumber,
  setCurrentDocumentNumber,
  finishExercise,
  tryLater,
  trainingSet,
  disciplineTitle,
  documents,
  setHintsEnabled
}: AnswerSectionPropsType): ReactElement => {
  const [isArticleMissing, setIsArticleMissing] = useState<boolean>(false)
  // The currently entered answer
  const [input, setInput] = useState<string>('')
  // The last submitted answer
  const [submission, setSubmission] = useState<string | null>(null)
  // The result of the submitted answer
  const [result, setResult] = useState<SimpleResultType | null>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const touchable: any = React.createRef()

  const document = documents[currentDocumentNumber]
  const totalNumbers = documents.length
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

    if (!secondAttempt) {
      await storeResult(newResult)
    }
    if (newResult !== 'similar') {
      setHintsEnabled(true)
    }
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
      // TODO Is the article relevant here? Before article was checked for alternatives but not for default word
      // Word is similar to either the document or an alternative
      return 'similar'
    }

    return 'incorrect'
  }

  const giveUp = async (): Promise<void> => {
    const previousResult = result
    setResult('incorrect')
    await storeResult(previousResult ?? 'incorrect')
    setHintsEnabled(true)
  }

  const continueExercise = (): void => {
    setResult(null)
    setSubmission(null)
    setInput('')
    setHintsEnabled(false)

    if (currentDocumentNumber === totalNumbers - 1) {
      finishExercise()
    } else {
      setCurrentDocumentNumber(currentDocumentNumber + 1)
    }
  }

  const storeResult = async (score: SimpleResultType): Promise<void> => {
    try {
      const exercise = (await AsyncStorage.getExercise(ExerciseKeys.writeExercise)) ?? {}
      exercise[disciplineTitle] = exercise[disciplineTitle] ?? {}
      exercise[disciplineTitle][trainingSet] = exercise[disciplineTitle][trainingSet] ?? {}

      exercise[disciplineTitle][trainingSet][document.word] = {
        ...document,
        result: score
      }

      await AsyncStorage.setExercise(ExerciseKeys.writeExercise, exercise)

      const session = await AsyncStorage.getSession()
      if (session === null) {
        throw new Error('Session is not saved correctly!')
      }
      const newSession = {
        ...session,
        retryData: {
          data: documents.slice(currentDocumentNumber + 1, totalNumbers)
        }
      }
      await AsyncStorage.setSession(newSession)
    } catch (e) {
      console.error(e)
    }
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

  return (
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

        {result && <Feedback result={result} document={document} submission={submission} />}

        <Actions
          tryLater={tryLater}
          giveUp={giveUp}
          input={input}
          result={result}
          checkEntry={checkEntry}
          continueExercise={continueExercise}
          secondAttempt={secondAttempt}
          isFinished={currentDocumentNumber === totalNumbers - 1}
        />
      </StyledContainer>
    </Pressable>
  )
}

export default AnswerSection
