import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { TrophyIcon } from '../../assets/images'

const TrophyContainer = styled.View`
  margin-top: 11px;
  display: flex;
  flex-direction: row;
`

const TrophyIconStyled = styled(TrophyIcon)`
  margin-right: 5px;
`

interface PropsType {
  level: number
}

const Trophy = ({ level }: PropsType): ReactElement => {
  const trophies = []
  for (let i = 0; i < level; i += 1) {
    trophies.push(<TrophyIconStyled key={`trophy-${i}`} testID={`trophy-${i}`} width={15} height={15} />)
  }
  return <TrophyContainer>{trophies}</TrophyContainer>
}

export default Trophy
