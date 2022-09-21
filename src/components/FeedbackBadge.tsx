import { useIsFocused } from '@react-navigation/native'
import React, { ReactElement, useState, useEffect } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import { EXERCISE_FEEDBACK, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../constants/data'
import { useLoadAsync } from '../hooks/useLoadAsync'
import AsyncStorage from '../services/AsyncStorage'
import { getLabels } from '../services/helpers'
import { ContentSecondaryLight } from './text/Content'

const BadgeContainer = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: ${props => props.theme.colors.lightGreyBackground};
  width: 100%;
`
const BadgeText = styled(ContentSecondaryLight)`
  font-style: italic;
  margin-left: ${props => props.theme.spacings.xs};
`

interface FeedbackBadgeProps {
  levelIdentifier: {
    disciplineId: number
    level: number
  } | null
  setFeedback: (feedback: EXERCISE_FEEDBACK) => void
}

const FeedbackBadge = (props: FeedbackBadgeProps): ReactElement | null => {
  const [feedback, setFeedback] = useState<EXERCISE_FEEDBACK>(EXERCISE_FEEDBACK.NONE)
  const { setFeedback: setFeedbackOnParent, levelIdentifier } = props
  const { disciplineId, level } = levelIdentifier ?? {}
  const { data: scores, loading, refresh } = useLoadAsync(AsyncStorage.getExerciseProgress, null)
  const isFocused = useIsFocused()

  useEffect(() => {
    const updateFeedback = (feedback: EXERCISE_FEEDBACK) => {
      setFeedback(feedback)
      setFeedbackOnParent(feedback)
    }
    if (!loading && disciplineId != null && level != null && level !== 0) {
      /* eslint-disable @typescript-eslint/no-unnecessary-condition */
      const score = scores?.[disciplineId]?.[level]
      if (score) {
        updateFeedback(
          score > SCORE_THRESHOLD_POSITIVE_FEEDBACK ? EXERCISE_FEEDBACK.POSITIVE : EXERCISE_FEEDBACK.NEGATIVE
        )
      }
    }
  }, [loading, scores, disciplineId, level, setFeedbackOnParent])

  useEffect(() => {
    if (isFocused) {
      refresh()
    }
  }, [isFocused, refresh])

  if (feedback === EXERCISE_FEEDBACK.POSITIVE) {
    return (
      <BadgeContainer testID='positive-badge'>
        <ThumbsUpIcon width={wp('6%')} height={wp('6%')} />
        <BadgeText>{getLabels().exercises.feedback.positive}</BadgeText>
      </BadgeContainer>
    )
  }

  if (feedback === EXERCISE_FEEDBACK.NEGATIVE) {
    return (
      <BadgeContainer testID='negative-badge'>
        <ThumbsDownIcon width={wp('6%')} height={wp('6%')} />
        <BadgeText>{getLabels().exercises.feedback.negative}</BadgeText>
      </BadgeContainer>
    )
  }

  return null
}
export default FeedbackBadge
