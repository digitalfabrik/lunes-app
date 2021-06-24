import React, { useEffect, useState } from 'react'
import { SingleChoice } from './SingleChoice'
import { DocumentType } from '../../../constants/endpoints'
import { DocumentResultType } from '../../../navigation/NavigationTypes'
import { Answer, BUTTONS_THEME, SIMPLE_RESULTS } from '../../../constants/data'
import Button from '../../../components/Button'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { CloseButton, WhiteNextArrow } from '../../../../assets/images'
import { styles } from '../../../components/Actions'
import styled from 'styled-components/native'
import AudioPlayer from '../../../components/AudioPlayer'
import labels from '../../../constants/labels.json'
import Modal from "../../../components/Modal"
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS } from "../../../constants/colors";

const StyledImage = styled.Image`
  width: 100%;
  height: 35%;
  position: relative;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

const HeaderStyle = StyleSheet.create({
  headerText: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100
  },
})

interface SingleChoiceExercisePropsType {
  documents: DocumentType[]
  documentToAnswers: (document: DocumentType) => Answer[]
  onExerciseFinished: (results: DocumentResultType[]) => void
  navigation: any
  route: any
}

const ChoiceExerciseScreen = ({ documents, documentToAnswers, onExerciseFinished, navigation, route }: SingleChoiceExercisePropsType ) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [results, setResults] = useState<DocumentResultType[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { extraParams } = route.params

  const currentDocument = documents[currentWord]
  // Prevent regenerating false answers on every render
  useEffect(() => {
    setAnswers(documentToAnswers(currentDocument))
  }, [currentDocument, documentToAnswers])

  React.useLayoutEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={showModal} style={HeaderStyle.headerLeft}>
            <CloseButton />
            <Text style={HeaderStyle.title}>{labels.general.header.cancelExercise}</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={HeaderStyle.headerText}>{`${currentWord + 1} of ${documents.length}`}</Text>
        )
      }),
    [navigation, currentWord, documents]
  )

  const showModal = (): boolean => {
    setIsModalVisible(true)
    return true
  }

  const correctAnswer: Answer = {
    article: currentDocument.article,
    word: currentDocument.word
  }
  const count = documents.length

  const isAnswerEqual = (answer1: Answer, answer2: Answer): boolean => {
    return answer1.article === answer2.article && answer1.word === answer2.word
  }

  const onClickAnswer = (selectedAnswer: Answer) => {
    setSelectedAnswer(selectedAnswer)

    if (isAnswerEqual(selectedAnswer, correctAnswer)) {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.correct }
      setResults([...results, result])
    } else {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.incorrect }
      setResults([...results, result])
    }
  }

  const onFinishWord = () => {
    const exerciseFinished = currentWord + 1 >= count
    if (exerciseFinished) {
      onExerciseFinished(results)
    } else {
      setCurrentWord(prevState => prevState + 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <>
      <StyledImage
        source={{
          uri: documents[currentWord]?.document_image[0].image
        }}
      />
      <AudioPlayer document={documents[currentWord]} disabled={selectedAnswer === null} />
      <SingleChoice
        answers={answers}
        onClick={onClickAnswer}
        correctAnswer={correctAnswer}
        selectedAnswer={selectedAnswer}
      />
      <ButtonContainer>
        {selectedAnswer !== null && (
          <Button onPress={onFinishWord} theme={BUTTONS_THEME.dark}>
            <>
              <Text style={[styles.lightLabel, styles.arrowLabel]}>
                {currentWord + 1 >= count ? labels.exercises.showResults : labels.exercises.next}
              </Text>
              <WhiteNextArrow />
            </>
          </Button>
        )}
      </ButtonContainer>

      <Modal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
        extraParams={extraParams}
      />
    </>
  )
}

export default ChoiceExerciseScreen
