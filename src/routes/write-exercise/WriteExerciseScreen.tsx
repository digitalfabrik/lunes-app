import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AudioPlayer from '../../components/AudioPlayer'
import ExerciseHeader from '../../components/ExerciseHeader'
import ImageCarousel from '../../components/ImageCarousel'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import AnswerSection from './components/AnswerSection'

const Spinner = styled(ActivityIndicator)`
  width: 100%;
  height: ${hp('35%')}px;
  position: absolute;
  top: 0;
  background-color: ${props => props.theme.colors.lunesWhite};
`

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { extraParams, retryData } = route.params
  const { trainingSet, trainingSetId, disciplineTitle } = extraParams
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  // Hints (e.g. audio) are only enabled after an answer was entered and validated
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(false)
  const response = useLoadDocuments(trainingSetId)
  const documents = newDocuments ?? retryData?.data ?? response.data

  useEffect(() => {
    AsyncStorage.setSession(route.params).catch(e => console.error(e))
  }, [route.params])

  const tryLater = useCallback(() => {
    if (documents !== null) {
      const currDocument = documents[currentDocumentNumber]
      const newDocuments = documents.filter(d => d !== currDocument)
      newDocuments.push(currDocument)
      setNewDocuments(newDocuments)
    }
  }, [documents, currentDocumentNumber])

  const finishExercise = (): void => {
    AsyncStorage.clearSession().catch(e => console.error(e))
    setCurrentDocumentNumber(0)
    setNewDocuments(null)
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results: [] } })
  }

  const docsLength = documents?.length ?? 0
  const document = documents?.[currentDocumentNumber]

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentDocumentNumber}
        numberOfWords={docsLength}
      />

      {documents && document ? (
        <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'
        showsVerticalScrollIndicator={false}>
          <ImageCarousel images={document.document_image} />
          <AudioPlayer document={document} disabled={!hintsEnabled} />
          <AnswerSection
            currentDocumentNumber={currentDocumentNumber}
            setCurrentDocumentNumber={setCurrentDocumentNumber}
            documents={documents}
            finishExercise={finishExercise}
            tryLater={tryLater}
            trainingSet={trainingSet}
            disciplineTitle={disciplineTitle}
            setHintsEnabled={setHintsEnabled}
          />
        </KeyboardAwareScrollView>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default WriteExerciseScreen
