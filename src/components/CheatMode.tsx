import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { BUTTONS_THEME, SimpleResult, SIMPLE_RESULTS } from '../constants/data'
import { useLoadAsync } from '../hooks/useLoadAsync'
import { getDevMode } from '../services/AsyncStorage'
import { getLabels } from '../services/helpers'
import Button from './Button'

const CheatContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  transform: scale(0.6);
  margin-top: -${props => props.theme.spacings.sm};
  width: 100%;
`

type CheatModeProps = {
  cheat: (result: SimpleResult) => void
}

const CheatMode = ({ cheat }: CheatModeProps): ReactElement => {
  const { data: cheatsEnabled } = useLoadAsync(getDevMode, null)
  return (
    <>
      {cheatsEnabled && (
        <CheatContainer>
          <Button
            label={getLabels().exercises.cheat.succeed}
            onPress={() => cheat(SIMPLE_RESULTS.correct)}
            buttonTheme={BUTTONS_THEME.outlined}
          />
          <Button
            label={getLabels().exercises.cheat.fail}
            onPress={() => cheat(SIMPLE_RESULTS.incorrect)}
            buttonTheme={BUTTONS_THEME.outlined}
          />
        </CheatContainer>
      )}
    </>
  )
}
export default CheatMode
