import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RoutesParams } from '../../navigation/NavigationTypes'
import WriteExercise from './components/WriteExercise'

interface WriteExerciseScreenProps {
  route: RouteProp<RoutesParams, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>
}

const WriteExerciseScreen = ({ navigation, route }: WriteExerciseScreenProps): JSX.Element => (
  <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
    <WriteExercise navigation={navigation} route={route} />
  </KeyboardAwareScrollView>
)

export default WriteExerciseScreen
