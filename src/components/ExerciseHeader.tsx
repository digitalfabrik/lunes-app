import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { CloseCircleIconWhite } from '../../assets/images'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import CustomModal from './CustomModal'
import FeedbackModal from './FeedbackModal'
import { NavigationHeaderLeft } from './NavigationHeaderLeft'
import { NavigationTitle } from './NavigationTitle'
import { ContentSecondary } from './text/Content'

const ProgressBar = styled(RNProgressBar)`
  background-color: ${props => props.theme.colors.disabled};
`

const HeaderRightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ProgressText = styled(ContentSecondary)`
  margin-right: ${props => props.theme.spacings.sm};
`
// /* TODO Remove comment when LUN-269 is ready */
// const MenuIconPrimary = styled(MenuIcon)`
//   color: ${props => props.theme.colors.primary};
// `

interface ExerciseHeaderProps {
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  currentWord: number
  numberOfWords: number
}

const ExerciseHeader = ({ navigation, currentWord, numberOfWords }: ExerciseHeaderProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  const theme = useTheme()
  const progressText = numberOfWords !== 0 ? `${currentWord + 1} / ${numberOfWords}` : ''

  useEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <NavigationHeaderLeft onPress={() => setIsModalVisible(true)}>
            <CloseCircleIconWhite width={wp('7%')} height={wp('7%')} />
            <NavigationTitle>{labels.general.header.cancelExercise}</NavigationTitle>
          </NavigationHeaderLeft>
        ),
        headerRight: () => (
          <HeaderRightContainer>
            <ProgressText>{progressText}</ProgressText>
            {/* TODO Remove comment when LUN-269 is ready */}
            {/* <KebabMenu icon={<MenuIconPrimary width={wp('5%')} height={wp('5%')} />}> */}
            {/*  <HiddenItem title={labels.general.header.wordFeedback} onPress={() => setIsFeedbackModalVisible(true)} /> */}
            {/* </KebabMenu> */}
          </HeaderRightContainer>
        ),
        headerRightContainerStyle: {
          paddingHorizontal: wp('2%'),
          maxWidth: wp('25%')
        }
      }),
    [navigation, progressText, setIsModalVisible, setIsFeedbackModalVisible]
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
        color={theme.colors.progressIndicator}
      />

      <CustomModal
        testID='customModal'
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        text={labels.exercises.cancelModal.cancelAsk}
        confirmationButtonText={labels.exercises.cancelModal.cancel}
        cancelButtonText={labels.exercises.cancelModal.continue}
        confirmationAction={goBack}
      />
      <FeedbackModal visible={isFeedbackModalVisible} onClose={() => setIsFeedbackModalVisible(false)} />
    </>
  )
}
export default ExerciseHeader
