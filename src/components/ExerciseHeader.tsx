import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseCircleIconWhite } from '../../assets/images'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import ConfirmationModal from './ConfirmationModal'
import { NavigationHeaderLeft } from './NavigationHeaderLeft'
import { NavigationTitle } from './NavigationTitle'
import { ContentSecondary } from './text/Content'

const ProgressBar = styled(RNProgressBar)`
  background-color: ${props => props.theme.colors.disabled};
`

interface ExerciseHeaderProps {
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  currentWord: number
  numberOfWords: number
}

const ExerciseHeader = ({ navigation, currentWord, numberOfWords }: ExerciseHeaderProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const theme = useTheme()
  const progressText = numberOfWords !== 0 ? `${currentWord + 1} ${labels.general.header.of} ${numberOfWords}` : ''

  useEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <NavigationHeaderLeft onPress={() => setIsModalVisible(true)}>
            <CloseCircleIconWhite width={wp('7%')} height={wp('7%')} />
            <NavigationTitle>{labels.general.header.cancelExercise}</NavigationTitle>
          </NavigationHeaderLeft>
        ),
        headerRight: () => <ContentSecondary>{progressText}</ContentSecondary>,
        headerRightContainerStyle: {
          paddingHorizontal: wp('4%'),
          maxWidth: wp('25%')
        }
      }),
    [navigation, progressText, setIsModalVisible]
  )

  useEffect(() => {
    const showModal = (): boolean => {
      setIsModalVisible(true)
      return true
    }
    const bEvent = BackHandler.addEventListener('hardwareBackPress', showModal)
    return () => bEvent.remove()
  }, [])

  const goBack = (): void => {
    setIsModalVisible(false)
    navigation.goBack()
  }

  return (
    <>
      <ProgressBar
        progress={numberOfWords > 0 ? currentWord / numberOfWords : 0}
        color={theme.colors.exerciseProgressIndicator}
      />

      <ConfirmationModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        text={labels.exercises.cancelModal.cancelAsk}
        confirmationButtonText={labels.exercises.cancelModal.cancel}
        cancelButtonText={labels.exercises.cancelModal.continue}
        confirmationAction={goBack}
      />
    </>
  )
}
export default ExerciseHeader
