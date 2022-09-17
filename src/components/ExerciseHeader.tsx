import { CommonNavigationAction } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import { MenuIcon } from '../../assets/images'
import { FeedbackType } from '../constants/data'
import { Route, RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'
import FeedbackModal from './FeedbackModal'
import Modal from './Modal'
import NavigationHeaderLeft from './NavigationHeaderLeft'
import OverflowMenu from './OverflowMenu'
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

const StyledMenuIcon = styled(MenuIcon)`
  color: ${props => props.theme.colors.primary};
`

interface ExerciseHeaderProps {
  navigation: StackNavigationProp<RoutesParams, Route>
  closeExerciseAction: CommonNavigationAction
  feedbackType: FeedbackType
  feedbackForId: number
  currentWord?: number
  numberOfWords?: number
  confirmClose?: boolean
  labelOverride?: string
  isCloseButton?: boolean
}

const ExerciseHeader = ({
  navigation,
  closeExerciseAction,
  feedbackType,
  feedbackForId,
  currentWord,
  numberOfWords,
  confirmClose = true,
  labelOverride,
  isCloseButton = true,
}: ExerciseHeaderProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  const theme = useTheme()
  const showProgress = numberOfWords !== undefined && numberOfWords > 0 && currentWord !== undefined
  const progressText = showProgress ? `${currentWord + 1} / ${numberOfWords}` : ''

  useEffect(() => {
    const renderHeaderLeft = () => (
      <NavigationHeaderLeft
        title={labelOverride ?? getLabels().general.header.cancelExercise}
        onPress={confirmClose ? () => setIsModalVisible(true) : () => navigation.dispatch(closeExerciseAction)}
        isCloseButton={isCloseButton}
      />
    )

    const renderHeaderRight = () => (
      <HeaderRightContainer>
        <ProgressText>{progressText}</ProgressText>
        <OverflowMenu icon={<StyledMenuIcon width={wp('5%')} height={wp('5%')} />}>
          <HiddenItem title={getLabels().general.header.wordFeedback} onPress={() => setIsFeedbackModalVisible(true)} />
        </OverflowMenu>
      </HeaderRightContainer>
    )

    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
      headerRightContainerStyle: {
        paddingHorizontal: theme.spacingsPlain.sm,
        maxWidth: wp('25%'),
      },
    })
  }, [
    navigation,
    progressText,
    setIsModalVisible,
    setIsFeedbackModalVisible,
    confirmClose,
    closeExerciseAction,
    labelOverride,
    isCloseButton,
    theme.spacingsPlain.sm,
  ])

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

      <Modal
        testID='customModal'
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        text={getLabels().exercises.cancelModal.cancelAsk}
        confirmationButtonText={getLabels().exercises.cancelModal.cancel}
        confirmationAction={goBack}
      />
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
        feedbackType={feedbackType}
        feedbackForId={feedbackForId}
      />
    </>
  )
}
export default ExerciseHeader
