import React, { ReactElement, useState, useEffect } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import { SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../constants/data'
import useLoadAsync from '../hooks/useLoadAsync'
import AsyncStorage from '../services/AsyncStorage'
import { getLabels } from '../services/helpers'
import { ContentSecondaryLight } from './text/Content'

const BadgeContainer = styled.View`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: ${props => props.theme.colors.networkErrorBackground};
  width: 100%;
`
const BadgeText = styled(ContentSecondaryLight)`
  font-style: italic;
  margin-left: ${props => props.theme.spacings.xs};
`

interface FeedbackBadgeProps {
  disciplineId: number
  level: number
}

export const enum FEEDBACK {
  POSITIVE,
  NONE,
  NEGATIVE,
}

const FeedbackModal = (props: FeedbackBadgeProps | null): ReactElement => {
  const [feedback, setFeedback] = useState<FEEDBACK>(FEEDBACK.NONE)
  const { setFeedback: setFeedbackOnParent, feedbackInfo } = props
  const { disciplineId, level } = feedbackInfo ?? {}
  const { data: scores } = useLoadAsync(AsyncStorage.getExerciseProgress, null)

  useEffect(() => {
    const updateFeedback = feedback => {
      setFeedback(feedback)
      setFeedbackOnParent(feedback)
    }
    if (scores && disciplineId && level && level !== 0) {
      const score = scores[disciplineId]?.[level]
      if (score) {
        updateFeedback(score > SCORE_THRESHOLD_POSITIVE_FEEDBACK ? FEEDBACK.POSITIVE : FEEDBACK.NEGATIVE)
      }
    }
  }, [scores, disciplineId, level, setFeedbackOnParent])

  if (feedback === FEEDBACK.POSITIVE) {
    return (
      <BadgeContainer>
        <ThumbsUpIcon width={wp('6%')} height={wp('6%')} />
        <BadgeText>{getLabels().exercises.feedback.positive}</BadgeText>
      </BadgeContainer>
    )
  }

  if (feedback === FEEDBACK.NEGATIVE) {
    return (
      <BadgeContainer>
        <ThumbsDownIcon width={wp('6%')} height={wp('6%')} />
        <BadgeText>{getLabels().exercises.feedback.negative}</BadgeText>
      </BadgeContainer>
    )
  }

  return null
}
export default FeedbackModal
