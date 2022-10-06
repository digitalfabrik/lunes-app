import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import { EXERCISE_FEEDBACK } from '../constants/data'
import { getLabels } from '../services/helpers'
import { HintSecondary } from './text/Hint'

const BadgeContainer = styled.View`
  display: flex;
  flex-flow: row nowrap;
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm};
  background-color: ${props => props.theme.colors.lightGreyBackground};
  width: 100%;
`
const BadgeText = styled(HintSecondary)`
  font-style: italic;
  margin-left: ${props => props.theme.spacings.xs};
  align-self: center;
`

const BadgeIcon = styled.View`
  height: ${hp('3.5%')}px;
  max-height: ${wp('5%')}px;
`

interface FeedbackBadgeProps {
  feedback: EXERCISE_FEEDBACK
}

const FeedbackBadge = ({ feedback }: FeedbackBadgeProps): ReactElement | null => {
  const { positive, negative } = { ...getLabels().exercises.feedback }
  if (feedback === EXERCISE_FEEDBACK.POSITIVE) {
    return (
      <BadgeContainer testID='positive-badge'>
        <BadgeIcon>
          <ThumbsUpIcon height='100%' />
        </BadgeIcon>
        <BadgeText>{positive}</BadgeText>
      </BadgeContainer>
    )
  }

  if (feedback === EXERCISE_FEEDBACK.NEGATIVE) {
    return (
      <BadgeContainer testID='negative-badge'>
        <BadgeIcon>
          <ThumbsDownIcon height='100%' />
        </BadgeIcon>
        <BadgeText>{negative}</BadgeText>
      </BadgeContainer>
    )
  }

  return null
}
export default FeedbackBadge
