import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { TrophyIcon } from '../../assets/images'

const TrophyContainer = styled.View`
  margin-top: ${props => props.theme.spacings.xs};
  display: flex;
  flex-direction: row;
`

const TrophyIconStyled = styled(TrophyIcon)`
  margin-right: ${props => props.theme.spacings.xxs};
`

interface PropsType {
  level: number
}

const Trophy = ({ level }: PropsType): ReactElement => {
  const trophies = []
  for (let i = 0; i < level; i += 1) {
    trophies.push(<TrophyIconStyled key={`trophy-${i}`} testID={`trophy-${i}`} width={hp('1.5%')} height={hp('3%')} />)
  }
  return <TrophyContainer>{trophies}</TrophyContainer>
}

export default Trophy
