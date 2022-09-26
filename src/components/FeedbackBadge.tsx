import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import { EXERCISE_FEEDBACK } from '../constants/data'
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
  feedback: EXERCISE_FEEDBACK
}

const FeedbackBadge = ({ feedback }: FeedbackBadgeProps): ReactElement | null => {
  if (feedback === EXERCISE_FEEDBACK.POSITIVE) {
    return (
      <BadgeContainer testID='positive-badge'>
        <ThumbsUpIcon width={hp('3.5%')} height={hp('3.5%')} />
        <BadgeText>{getLabels().exercises.feedback.positive}</BadgeText>
      </BadgeContainer>
    )
  }

  if (feedback === EXERCISE_FEEDBACK.NEGATIVE) {
    return (
      <BadgeContainer testID='negative-badge'>
        <ThumbsDownIcon width={hp('4%')} height={hp('4%')} />
        <BadgeText>{getLabels().exercises.feedback.negative}</BadgeText>
      </BadgeContainer>
    )
  }

  return null
}
export default FeedbackBadge
