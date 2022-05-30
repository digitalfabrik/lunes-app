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
  height: ${hp('5%')}px;
  background-color: ${props => props.color};
  margin: ${props => props.theme.spacings.xs} 10px;
`

interface PropsType {
  current: Exercise
  index: number
}

const LockingLane = ({ current, index }: PropsType): ReactElement => {
  let Icon
  if (current.level < index) {
    Icon = LockIcon
  } else if (current.level === index) {
    Icon = CircleIconBlue
  } else {
    Icon = CheckCircleIconBlue
  }

  const colorPre = current.level < index ? COLORS.black : COLORS.lockingLane
  const colorPost = current.level <= index ? COLORS.black : COLORS.lockingLane

  return (
    <Container>
      <Line color={index === 0 ? 'transparent' : colorPre} />
      <Icon />
      <Line color={index === EXERCISES.length - 1 ? 'transparent' : colorPost} />
    </Container>
  )
}

export default LockingLane
