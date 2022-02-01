import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ServerResponseHandler from '../../components/ServerResponseHandler'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import WriteExercise from './components/WriteExercise'

interface WriteExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenPropsType): JSX.Element => {
  const { discipline, retryData } = route.params

  const { data, loading, error, refresh } = useLoadDocuments(discipline, true)
  const documents = retryData?.data ?? data

  return (
    <>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && (
          <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
            <WriteExercise documents={documents} navigation={navigation} route={route} />
          </KeyboardAwareScrollView>
        )}
      </ServerResponseHandler>
    </>
  )
}

export default WriteExerciseScreen
