import React, { useState, ReactElement } from 'react'
import { TouchableOpacity, Pressable, Keyboard } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import stringSimilarity from 'string-similarity'
import styled from 'styled-components/native'

import { CloseIcon } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import { ExerciseKeys, SimpleResultType } from '../../../constants/data'
import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { COLORS } from '../../../constants/theme/colors'
import AsyncStorage from '../../../services/AsyncStorage'
import Actions from './Actions'
import Feedback from './FeedbackSection'
import Popover from './Popover'
import PopoverContent from './PopoverContent'

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
  height: 16%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-radius: 2px;
  padding-right: 15px;
  padding-left: 15px;
  margin-top: 12%;
  margin-bottom: 12%;
  border-color: ${prop => prop.styledBorderColor};
`
const StyledTextInput = styled.TextInput`
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
}

const almostCorrectThreshold = 0.6
const playTTSThreshold = 0.5

const AnswerSection = ({
  currentDocumentNumber,
  setCurrentDocumentNumber,
  finishExercise,
  tryLater,
  trainingSet,
  disciplineTitle,
  documents
}: AnswerSectionPropsType): ReactElement => {
  const touchable: any = React.createRef()
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [input, setInput] = useState('')
  const [submission, setSubmission] = useState('')
  const [result, setResult] = useState('')
  const [secondAttempt, setSecondAttempt] = useState(false)
  const document = documents[currentDocumentNumber]
  const totalNumbers = documents.length
  const [isFocused, setIsFocused] = useState(false)
  const [TTSToPlay, setTTSToPlay] = useState('')

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const checkEntry = async (): Promise<void> => {
    setSubmission(input)
    const splitInput = input.trim().split(' ')

    if (splitInput.length < 2) {
      setIsPopoverVisible(true)
      return
    }

    const article = capitalizeFirstLetter(splitInput[0])
    const word = splitInput[1]

    if (!validateForSimilar(article, word)) {
      setResult('incorrect')
      await storeResult('incorrect')
    } else if (validateForCorrect(article, word)) {
      setResult('correct')
      await storeResult('correct')
    } else if (secondAttempt) {
      setResult('similar')
      await storeResult('similar')
    } else {
      setInput(input)
      setSecondAttempt(true)
      return
    }
    setSecondAttempt(false)
  }

  const validateForCorrect = (inputArticle: string, inputWord: string): boolean => {
    const exactAnswer = inputArticle === document?.article.value && inputWord === document?.word

    const altAnswer = document?.alternatives?.some(
      ({ article, word }) => inputArticle === article.value && inputWord === word
    )
    if (altAnswer) {
      const playTTS = stringSimilarity.compareTwoStrings(inputWord, document.word) < playTTSThreshold
      if (playTTS) {
        setTTSToPlay(`${inputArticle} ${inputWord}`)
      }
    }
    return exactAnswer || altAnswer
  }

  const validateForSimilar = (inputArticle: string, inputWord: string): boolean => {
    if (validateForCorrectWithoutArticle(inputWord)) {
      return true
    }
    const origCheck = stringSimilarity.compareTwoStrings(inputWord, document.word) > almostCorrectThreshold

    const altCheck = document.alternatives.some(
      ({ article, word }) =>
        inputArticle === article.value && stringSimilarity.compareTwoStrings(inputWord, word) > almostCorrectThreshold
    )
    return origCheck || altCheck
  }

  const giveUp = async (): Promise<void> => {
    setResult('giveUp')
    await storeResult(secondAttempt ? 'similar' : 'incorrect')
  }

  const validateForCorrectWithoutArticle = (inputWord: string): boolean => {
    const exactAnswer = inputWord === document?.word

    const altAnswer = document?.alternatives?.some(({ word }) => inputWord === word)
    return exactAnswer || altAnswer
  }

  const getNextWord = (): void => {
    setResult('')
    setInput('')
    setSecondAttempt(false)

    if (currentDocumentNumber === totalNumbers - 1) {
      finishExercise()
      return
    }
    setCurrentDocumentNumber(currentDocumentNumber + 1)
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

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <AudioPlayer document={document} disabled={result === '' && !secondAttempt} TTSToPlay={TTSToPlay} />
      <StyledContainer>
        <Popover isVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible} ref={touchable}>
          <PopoverContent />
        </Popover>

        <TextInputContainer testID='input-field' ref={touchable} styledBorderColor={getBorderColor()}>
          <StyledTextInput
            placeholder={secondAttempt ? labels.exercises.write.newTry : labels.exercises.write.insertAnswer}
            placeholderTextColor={COLORS.lunesBlackLight}
            value={input}
            onChangeText={text => setInput(text)}
            editable={result === ''}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={checkEntry}
          />
          {(isFocused || (result === '' && input !== '')) && (
            <TouchableOpacity onPress={() => setInput('')}>
              <CloseIcon />
            </TouchableOpacity>
          )}
        </TextInputContainer>

        <Feedback secondAttempt={secondAttempt} result={result} document={document} input={submission} />

        <Actions
          tryLater={tryLater}
          giveUp={giveUp}
          input={input}
          result={result}
          checkEntry={checkEntry}
          getNextWord={getNextWord}
          secondAttempt={secondAttempt}
          isFinished={currentDocumentNumber === totalNumbers - 1}
        />
      </StyledContainer>
    </Pressable>
  )
}

export default AnswerSection
