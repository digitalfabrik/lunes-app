import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState, ReactElement } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { FeedbackIcon } from '../../assets/images'
import { ExerciseKey } from '../constants/data'
import { FeedbackTarget } from '../models/Feedback'
import { Route, RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'
import FeedbackModal from './FeedbackModal'
import Modal from './Modal'
import NavigationHeaderLeft from './NavigationHeaderLeft'
import { ContentSecondary } from './text/Content'

const ProgressBar = styled(RNProgressBar)<{ disabledColor: string }>`
  background-color: ${props => props.disabledColor};
`

const HeaderRightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ProgressText = styled(ContentSecondary)`
  margin-right: ${props => props.theme.spacings.sm};
`

const FeedbackButton = styled.Pressable`
  padding: ${props => props.theme.spacings.xs};
  justify-content: center;
  align-items: center;
`

type ExerciseHeaderProps = {
  navigation: StackNavigationProp<RoutesParams, Route>
  exerciseKey?: ExerciseKey
  feedbackTarget?: FeedbackTarget
  currentWord?: number
  numberOfWords?: number
  confirmClose?: boolean
}

const ExerciseHeader = ({
  navigation,
  feedbackTarget,
  currentWord,
  numberOfWords,
  confirmClose = true,
  exerciseKey,
}: ExerciseHeaderProps): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  const shouldShowFeedback = feedbackTarget !== undefined
  const theme = useTheme()
  const showProgress = numberOfWords !== undefined && numberOfWords > 0 && currentWord !== undefined
  const progressText = showProgress ? `${currentWord + 1} / ${numberOfWords}` : ''

  useEffect(() => {
    const renderHeaderLeft = () => (
      <NavigationHeaderLeft
        title={getLabels().general.header.cancelExercise}
        onPress={confirmClose ? () => setIsModalVisible(true) : () => navigation.pop()}
        isCloseButton
      />
    )

    const renderHeaderRight = () => (
      <HeaderRightContainer>
        <ProgressText>{progressText}</ProgressText>
        {shouldShowFeedback && (
          <FeedbackButton
            onPress={() => setIsFeedbackModalVisible(true)}
            accessibilityLabel={getLabels().general.header.wordFeedback}
            accessibilityRole='button'
          >
            <FeedbackIcon width={28} height={28} />
          </FeedbackButton>
        )}
      </HeaderRightContainer>
    )

    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
      headerRightContainerStyle: {
        paddingHorizontal: theme.spacingsPlain.xs,
        maxWidth: '25%',
      },
    })
  }, [
    shouldShowFeedback,
    navigation,
    progressText,
    setIsModalVisible,
    setIsFeedbackModalVisible,
    confirmClose,
    currentWord,
    exerciseKey,
    numberOfWords,
    theme.spacingsPlain.xs,
    theme.spacingsPlain.xl,
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
    navigation.pop()
  }

  return (
    <>
      {showProgress && (
        <ProgressBar
          animatedValue={numberOfWords > 0 ? currentWord / numberOfWords : 0}
          color={theme.colors.progressIndicatorTraining}
          disabledColor={theme.colors.disabled}
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
      {feedbackTarget !== undefined && (
        <FeedbackModal
          visible={isFeedbackModalVisible}
          onClose={() => setIsFeedbackModalVisible(false)}
          feedbackTarget={feedbackTarget}
        />
      )}
    </>
  )
}
export default ExerciseHeader
