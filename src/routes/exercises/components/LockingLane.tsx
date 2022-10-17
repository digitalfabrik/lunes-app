import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CheckCircleIconBlue, CircleIconBlue, LockIcon } from '../../../../assets/images'
import { Exercise, EXERCISES } from '../../../constants/data'
import { COLORS } from '../../../constants/theme/colors'

const Container = styled.View`
  justify-content: center;
  margin: ${props => props.theme.spacings.xs}
  max-height: ${hp('10%')}px;
`

const Line = styled.View<{ color: string }>`
  width: 2px;
  height: ${props => props.theme.spacings.xxl};
  background-color: ${props => props.color};
  margin: ${props => props.theme.spacings.xs} 10px;
`

interface LockingLaneProps {
  nextExercise: Exercise | null
  index: number
}

const LockingLane = ({ nextExercise, index }: LockingLaneProps): ReactElement => {
  let Icon
  if (nextExercise && nextExercise.level < index) {
    Icon = LockIcon
  } else if (nextExercise && nextExercise.level === index) {
    Icon = CircleIconBlue
  } else {
    Icon = CheckCircleIconBlue
  }

  const colorPre = nextExercise && nextExercise.level < index ? COLORS.black : COLORS.progressIndicator
  const colorPost = nextExercise && nextExercise.level <= index ? COLORS.black : COLORS.progressIndicator

  return (
    <Container>
      <Line color={index === 0 ? 'transparent' : colorPre} />
      <Icon width='100%' />
      <Line color={index === EXERCISES.length - 1 ? 'transparent' : colorPost} />
    </Container>
  )
}

export default LockingLane
