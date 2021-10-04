import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ExerciseHeader from '../../components/ExerciseHeader'
import { DocumentType } from '../../constants/endpoints'
import ImageCarousel from '../../components/ImageCarousel'
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

  return (
    <View>
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
            {!newDocuments && <Spinner />}
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
    </View>
  )
}

export default WriteExerciseScreen
