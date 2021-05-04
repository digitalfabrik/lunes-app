import React, { useState } from 'react'
import { View, TouchableOpacity, TextInput, Platform, StyleSheet } from 'react-native'
import { CloseIcon, VolumeUp } from '../../assets/images'
import { COLORS } from '../constants/colors'
import { IAnswerSectionProps } from '../interfaces/exercise'
import Popover from './Popover'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Feedback from './FeedbackSection'
import stringSimilarity from 'string-similarity'
import Actions from './Actions'
import PopoverContent from './PopoverContent'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: hp('65%')
  },
  textInputContainer: {
    width: wp('80%'),
    height: hp('8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 15,
    marginBottom: hp('6%')
  },
  textInput: {
    fontSize: wp('4.5%'),
    fontWeight: 'normal',
    letterSpacing: 0.11,
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesBlack,
    width: wp('60%')
  },
  volumeIcon: {
    position: 'absolute',
    top: -20,
    left: '45%',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 3,
    shadowOpacity: 10
  }
})
const AnswerSection = ({
  currentDocumentNumber,
  setCurrentDocumentNumber,
  finishExercise,
  tryLater,
  trainingSet,
  disciplineTitle,
  documents
}: IAnswerSectionProps) => {
  const touchable: any = React.createRef()
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState('')
  const [submission, setSubmission] = useState('')
  const [result, setResult] = useState('')
  const [secondAttempt, setSecondAttempt] = useState(false)
  const document = documents[currentDocumentNumber]
  const totalNumbers = documents.length
  const [isFocused, setIsFocused] = useState(false)

  React.useEffect(() => {
    const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener('FinishedPlaying', () => setIsActive(false))

    const _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () => setIsActive(false))

    return () => {
      _onSoundPlayerFinishPlaying.remove()
      _onTtsFinishPlaying.remove()
    }
  }, [])

  const checkEntry = () => {
    setSubmission(input)
    const splitInput = input.trim().split(' ')

    if (splitInput.length < 2) {
      setIsPopoverVisible(true)
      return
    }

    const article = splitInput[0].toLowerCase()
    const word = splitInput[1]

    if (!validateForSimilar(article, word)) {
      setResult('incorrect')
      storeResult('incorrect')
    } else if (validateForCorrect(article, word)) {
      setResult('correct')
      storeResult('correct')
    } else if (secondAttempt) {
      setResult('similar')
      storeResult('similar')
    } else {
      setInput('')
      setSecondAttempt(true)
      return
    }
    setSecondAttempt(false)
  }

  const validateForCorrect = (inputArticle: string, inputWord: string) => {
    const exactAnswer = inputArticle === document?.article && inputWord === document?.word

    const altAnswer = document?.alternatives?.some(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ article, alt_word }) => inputArticle === article && inputWord === alt_word
    )
    return exactAnswer || altAnswer
  }

  const validateForSimilar = (inputArticle: string, inputWord: string) => {
    const origCheck =
      document &&
      inputArticle === document.article &&
      stringSimilarity.compareTwoStrings(inputWord, document.word) > 0.4

    const altCheck = document?.alternatives?.some(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ article, alt_word }) =>
        inputArticle === article && stringSimilarity.compareTwoStrings(inputWord, alt_word) > 0.4
    )
    return origCheck || altCheck
  }

  const getNextWord = () => {
    setResult('')
    setInput('')
    setSecondAttempt(false)

    if (currentDocumentNumber === totalNumbers - 1) {
      finishExercise()
    }
    setCurrentDocumentNumber(currentDocumentNumber + 1)
  }

  const storeResult = async (score: string) => {
    await AsyncStorage.getItem('Vocabulary Trainer').then(value => {
      const jsonValue = value ? JSON.parse(value) : {}

      if (!jsonValue?.[disciplineTitle]?.[trainingSet]) {
        if (!jsonValue?.[disciplineTitle]) {
          jsonValue[disciplineTitle] = {}
        }
        jsonValue[disciplineTitle][trainingSet] = {}
      }

      if (document) {
        jsonValue[disciplineTitle][trainingSet][document.word] = {
          ...document,
          result: score
        }
      }

      AsyncStorage.setItem('Vocabulary Trainer', JSON.stringify(jsonValue))

      AsyncStorage.getItem('session').then(session => {
        const jsValue = JSON.parse(session)
        const newData = JSON.stringify({
          ...jsValue,
          retryData: {
            data: documents.slice(currentDocumentNumber + 1, totalNumbers)
          }
        })
        AsyncStorage.setItem('session', newData)
      })
    })
  }

  const handleSpeakerClick = (audio?: string) => {
    setIsActive(true)

    // Don't use soundplayer for IOS, since IOS doesn't support .ogg files
    if (audio && Platform.OS !== 'ios') {
      // audio from API
      SoundPlayer.playUrl(document?.audio)
    } else {
      Tts.speak(`${document?.article} ${document?.word}`, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC'
        }
      })
    }
  }

  const getBorderColor = () => {
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

  const volumeIconColor =
    result === '' && !secondAttempt ? COLORS.lunesBlackUltralight : isActive ? COLORS.lunesRed : COLORS.lunesRedDark

  const volumeIconStyle = [styles.volumeIcon, (result !== '' || secondAttempt) && !isActive && styles.shadow]

  return (
    <View style={styles.container}>
      <Popover isVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible} ref={touchable}>
        <PopoverContent />
      </Popover>

      <TouchableOpacity
        testID='volume-button'
        disabled={result === '' && !secondAttempt}
        style={volumeIconStyle}
        onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={volumeIconColor} />
      </TouchableOpacity>

      <View
        testID='input-field'
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: getBorderColor()
          }
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={secondAttempt ? 'Try again' : 'Enter Word with article'}
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
      </View>

      <Feedback secondAttempt={secondAttempt} result={result} document={document} input={submission} />

      <Actions
        tryLater={tryLater}
        giveUp={async () => {
          await storeResult('incorrect')
          getNextWord()
        }}
        input={input}
        result={result}
        checkEntry={checkEntry}
        getNextWord={getNextWord}
        secondAttempt={secondAttempt}
        isFinished={currentDocumentNumber === totalNumbers - 1}
      />
    </View>
  )
}

export default AnswerSection
