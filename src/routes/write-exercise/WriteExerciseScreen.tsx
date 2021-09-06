import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { COLORS } from '../../constants/colors'
import AnswerSection from './components/AnswerSection'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RouteProp } from '@react-navigation/native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '../../services/AsyncStorage'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import ExerciseHeader from '../../components/ExerciseHeader'
import ImageCarousel from '../../components/ImageCarousel'
import styled from 'styled-components/native'

const Spinner = styled(ActivityIndicator)`
  width: 100%;
  height: ${hp('35%')};
  position: absolute;
  top: 0;
  background-color: ${COLORS.lunesWhite};
`

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { extraParams, retryData } = route.params
  const { trainingSet, trainingSetId, disciplineTitle } = extraParams
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)

  let { loading, data: documents } = useLoadDocuments(trainingSetId)

  useEffect(() => {
    AsyncStorage.setSession(route.params).catch(e => console.error(e))
  }, [route.params])

  if (retryData) {
    documents = retryData.data
  }

  const tryLater = (): void => {
    if (documents !== null) {
      const currDocument = documents[currentDocumentNumber]
      const newDocuments = documents.filter(d => d !== currDocument)
      newDocuments.push(currDocument)
      documents = newDocuments
    }
  }

  const finishExercise = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    setCurrentDocumentNumber(0)
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results: [] } })
  }

  const docsLength = documents?.length ?? 0

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentDocumentNumber}
        numberOfWords={docsLength}
      />

      {documents !== null && documents[currentDocumentNumber]?.document_image.length > 0 && (
        <>
          <KeyboardAwareScrollView
            scrollEnabled={false}
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid
            keyboardShouldPersistTaps='always'>
            {loading && <Spinner />}
            <ImageCarousel images={documents[currentDocumentNumber]?.document_image} />
            <AnswerSection
              currentDocumentNumber={currentDocumentNumber}
              setCurrentDocumentNumber={setCurrentDocumentNumber}
              documents={documents}
              finishExercise={finishExercise}
              tryLater={tryLater}
              trainingSet={trainingSet}
              disciplineTitle={disciplineTitle}
            />
          </KeyboardAwareScrollView>
        </>
      )}
    </>
  )
}

export default WriteExerciseScreen
