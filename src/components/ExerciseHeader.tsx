import { CommonNavigationAction } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
// import { HiddenItem } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

// import { MenuIcon } from '../../assets/images'
import labels from '../constants/labels.json'
import { Route, RoutesParams } from '../navigation/NavigationTypes'
import CustomModal from './CustomModal'
import FeedbackModal from './FeedbackModal'
import NavigationHeaderLeft from './NavigationHeaderLeft'
// import OverflowMenu from './OverflowMenu'
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
// TODO Remove comment when LUN-269 is ready
// const MenuIconPrimary = styled(MenuIcon)`
//   color: ${props => props.theme.colors.primary};
// `

interface ExerciseHeaderProps {
  navigation: StackNavigationProp<RoutesParams, Route>
  closeExerciseAction: CommonNavigationAction
  currentWord?: number
  numberOfWords?: number
  confirmClose?: boolean
}

const ExerciseHeader = ({
  navigation,
  closeExerciseAction,
  currentWord,
  numberOfWords,
  confirmClose = true
}: ExerciseHeaderProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  const theme = useTheme()
  const showProgress = numberOfWords !== undefined && numberOfWords > 0 && currentWord !== undefined
  const progressText = showProgress ? `${currentWord + 1} / ${numberOfWords}` : ''

  useEffect(() => {
    const renderHeaderLeft = () => (
      <NavigationHeaderLeft
        title={labels.general.header.cancelExercise}
        onPress={confirmClose ? () => setIsModalVisible(true) : () => navigation.dispatch(closeExerciseAction)}
        isCloseButton
      />
    )

    const renderHeaderRight = () => (
      <HeaderRightContainer>
        <ProgressText>{progressText}</ProgressText>
        {/* TODO Remove comment when LUN-269 is ready */}
        {/* <OverflowMenu icon={<MenuIconPrimary width={wp('5%')} height={wp('5%')} />}> */}
        {/*  <HiddenItem title={labels.general.header.wordFeedback} onPress={() => setIsFeedbackModalVisible(true)} /> */}
        {/* </OverflowMenu> */}
      </HeaderRightContainer>
    )

    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
      headerRightContainerStyle: {
        paddingHorizontal: wp('2%'),
        maxWidth: wp('25%')
      }
    })
  }, [navigation, progressText, setIsModalVisible, setIsFeedbackModalVisible, confirmClose, closeExerciseAction])

  useEffect(() => {
    const showModal = (): boolean => {
      if (confirmClose) {
        setIsModalVisible(true)
        return true
      }
      return false
    }
    return BackHandler.addEventListener('hardwareBackPress', showModal).remove
  }, [confirmClose])

  const goBack = (): void => {
    setIsModalVisible(false)
    navigation.dispatch(closeExerciseAction)
  }

  return (
    <>
      {showProgress && (
        <ProgressBar
          progress={numberOfWords > 0 ? currentWord / numberOfWords : 0}
          color={theme.colors.progressIndicator}
        />
      )}

      <CustomModal
        testID='customModal'
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        text={labels.exercises.cancelModal.cancelAsk}
        confirmationButtonText={labels.exercises.cancelModal.cancel}
        confirmationAction={goBack}
      />
      <FeedbackModal visible={isFeedbackModalVisible} onClose={() => setIsFeedbackModalVisible(false)} />
    </>
  )
}
export default ExerciseHeader
