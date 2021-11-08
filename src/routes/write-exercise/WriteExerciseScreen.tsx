import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import AudioPlayer from '../../components/AudioPlayer'
import ErrorMessage from '../../components/ErrorMessage'
import ExerciseHeader from '../../components/ExerciseHeader'
import ImageCarousel from '../../components/ImageCarousel'
import Loading from '../../components/Loading'
import { ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import AnswerSection from './components/AnswerSection'

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { discipline, retryData } = route.params
  const { id } = discipline
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  // Hints (e.g. audio) are only enabled after an answer was entered and validated
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(false)

  const { data, loading, error, refresh } = useLoadDocuments(discipline)
  const documents = newDocuments ?? retryData?.data ?? data

  useEffect(() => {
    AsyncStorage.setSession({ ...discipline, exercise: ExerciseKeys.writeExercise, results: [] }).catch(e =>
      console.error(e)
    )
  }, [discipline])

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
    navigation.navigate('InitialSummary', {
      result: {
        discipline: { ...discipline },
        results: [],
        exercise: ExerciseKeys.writeExercise
      }
    })
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

      <Loading isLoading={loading}>
        <>
          <ErrorMessage error={error} refresh={refresh} />
          {documents && document && (
            <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='always'>
              <ImageCarousel images={document.document_image} />
              <AudioPlayer document={document} disabled={!hintsEnabled} />
              <AnswerSection
                currentDocumentNumber={currentDocumentNumber}
                setCurrentDocumentNumber={setCurrentDocumentNumber}
                documents={documents}
                finishExercise={finishExercise}
                tryLater={tryLater}
                disciplineId={id}
                setHintsEnabled={setHintsEnabled}
              />
            </ScrollView>
          )}
        </>
      </Loading>
    </>
  )
}

export default WriteExerciseScreen
