import React, { useState, ReactElement } from 'react'
import { TouchableOpacity, Pressable, Keyboard } from 'react-native'
import { CloseIcon } from '../../../../assets/images'
import { COLORS } from '../../../constants/colors'
import Popover from './Popover'
import Feedback from './FeedbackSection'
import stringSimilarity from 'string-similarity'
import Actions from './Actions'
import PopoverContent from './PopoverContent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DocumentType } from '../../../constants/endpoints'
import AsyncStorage from '../../../services/AsyncStorage'
import { ExerciseKeys, SimpleResultType } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import AudioPlayer from '../../../components/AudioPlayer'
import styled from 'styled-components/native'

const StyledContainer = styled.View`
  padding-top: 20;
  padding-bottom: 20;
  align-items: center;
  position: relative;
  width: 100%;
  height: ${hp('85%')};
`
const TextInputContainer = styled.View`
  width: ${wp('80%')};
  height: ${hp('8%')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1;
  border-radius: 2;
  padding-right: 15;
  padding-left: 15;
  margin-top: ${hp('6%')};
  margin-bottom: ${hp('6%')};
  border-color: ${(prop: StyledProps) => prop.StyledBorder};
`
const StyledTextInput = styled.TextInput`
  font-size: ${wp('4.5%')};
  font-weight: normal;
  letter-spacing: 0.11;
  font-family: 'SourceSansPro-Regular';
  color: ${COLORS.lunesBlack};
  width: ${wp('60%')};
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

interface StyledProps {
  StyledBorder: string
}

const almostCorrectThreshold = 0.6

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
      setInput('')
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
      <AudioPlayer document={document} disabled={result === '' && !secondAttempt} />
      <StyledContainer>
        <Popover isVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible} ref={touchable}>
          <PopoverContent />
        </Popover>

        <TextInputContainer testID='input-field' ref={touchable} StyledBorder={getBorderColor()}>
          <StyledTextInput
            placeholder={secondAttempt ? labels.exercises.write.newTry : labels.exercises.write.insertAnswer}
            placeholderTextColor={COLORS.lunesBlackLight}
            value={input}
            onChangeText={text => setInput(text)}
            editable={result === ''}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
