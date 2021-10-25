import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { DocumentType } from '../../constants/endpoints'
import { useLoadDocumentsRandomOrder } from '../../hooks/useLoadDocuments'
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
  const { extraParams, retryData } = route.params
  const { trainingSetId } = extraParams
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  // Hints (e.g. audio) are only enabled after an answer was entered and validated
  const response = useLoadDocumentsRandomOrder(trainingSetId)
  const documents = newDocuments ?? retryData?.data ?? response.data

  useEffect(() => {
    AsyncStorage.setSession(route.params).catch(e => console.error(e))
  }, [route.params])

  return (
    <>
      {documents ? (
        <WriteExercise navigation={navigation} route={route} documents={documents} setNewDocuments={setNewDocuments} />
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default WriteExerciseScreen
