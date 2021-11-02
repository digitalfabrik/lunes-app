import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ExerciseHeader from '../../components/ExerciseHeader'
import { ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import WriteExercise from './components/WriteExercise'

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
  const { discipline, retryData } = route.params
  const { id } = discipline
  const [currentDocumentNumber, setCurrentDocumentNumber] = useState(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  const response = useLoadDocuments(id)
  const documents = newDocuments ?? retryData?.data ?? response.data

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

      {documents && document ? (
        <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='always'>
          <WriteExercise
            currentDocumentNumber={currentDocumentNumber}
            setCurrentDocumentNumber={setCurrentDocumentNumber}
            documents={documents}
            finishExercise={finishExercise}
            tryLater={tryLater}
            disciplineId={id}
          />
        </ScrollView>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default WriteExerciseScreen
