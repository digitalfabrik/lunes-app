import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import { EXERCISE_FEEDBACK } from '../constants/data'
import { getLabels } from '../services/helpers'
import { HintSecondary } from './text/Hint'

const BadgeContainer = styled.View<{ feedback: EXERCISE_FEEDBACK }>`
  flex-flow: row nowrap;
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm};
  background-color: ${({ theme, feedback }) =>
    feedback === EXERCISE_FEEDBACK.POSITIVE ? theme.colors.correct : theme.colors.incorrect};
  width: 100%;
  border-top-left-radius: ${props => props.theme.spacings.xs};
  border-top-right-radius: ${props => props.theme.spacings.xs};
  z-index: 1;
  bottom: -${props => props.theme.spacingsPlain.xs}px;
`

const BadgeText = styled(HintSecondary)`
  font-style: italic;
  margin-left: ${props => props.theme.spacings.xs};
  align-self: center;
`

const BadgeIcon = styled.View`
  height: ${props => props.theme.sizes.defaultIcon}px;
  max-height: 22px;
`

type FeedbackBadgeProps = {
  feedback: EXERCISE_FEEDBACK
}

const FeedbackBadge = ({ feedback }: FeedbackBadgeProps): ReactElement | null => {
  const { positive, negative } = { ...getLabels().exercises.feedback }
  if (feedback === EXERCISE_FEEDBACK.POSITIVE) {
    return (
      <BadgeContainer feedback={feedback} testID='positive-badge'>
        <BadgeIcon>
          <ThumbsUpIcon height='100%' />
        </BadgeIcon>
        <BadgeText>{positive}</BadgeText>
      </BadgeContainer>
    )
  }
  if (feedback === EXERCISE_FEEDBACK.NEGATIVE) {
    return (
      <BadgeContainer feedback={feedback} testID='negative-badge'>
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
