import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ExerciseHeader from '../../components/ExerciseHeader'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import useScreenHeight from '../../hooks/useScreenHeight'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import { moveToEnd } from '../../services/helpers'
import WriteExercise from './components/WriteExercise'

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { discipline, retryData } = route.params
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  const height = useScreenHeight()

  const { data, loading, error, refresh } = useLoadDocuments(discipline)
  const documents = newDocuments ?? retryData?.data ?? data

  const tryLater = useCallback(() => {
    if (documents !== null) {
      setNewDocuments(moveToEnd(documents, currentDocumentNumber))
    }
    Keyboard.dismiss()
  }, [documents, currentDocumentNumber])

  const finishExercise = (results: DocumentResultType[]): void => {
    setCurrentDocumentNumber(0)
    setNewDocuments(null)
    navigation.navigate('InitialSummary', {
      result: {
        discipline: { ...discipline },
        results,
        exercise: ExerciseKeys.writeExercise
      }
    })
  }

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentDocumentNumber}
        numberOfWords={documents?.length ?? 0}
      />

      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && (
          <KeyboardAwareScrollView contentContainerStyle={{ height }} keyboardShouldPersistTaps='always'>
            <WriteExercise
              currentDocumentNumber={currentDocumentNumber}
              setCurrentDocumentNumber={setCurrentDocumentNumber}
              documents={documents}
              finishExercise={finishExercise}
              tryLater={tryLater}
            />
          </KeyboardAwareScrollView>
        )}
      </ServerResponseHandler>
    </>
  )
}

export default WriteExerciseScreen
