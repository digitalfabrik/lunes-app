import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { BUTTONS_THEME, SimpleResult, SIMPLE_RESULTS } from '../constants/data'
import labels from '../constants/labels.json'
import { useLoadAsync } from '../hooks/useLoadAsync'
import { getDevMode } from '../services/AsyncStorage'
import Button from './Button'

const CheatContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  transform: scale(0.6);
  margin-top: -30px;
  width: 100%;
`

interface CheatModeProps {
  cheat: (result: SimpleResult) => void
}

const CheatMode = ({ cheat }: CheatModeProps): ReactElement => {
  const { data: cheatsEnabled } = useLoadAsync(getDevMode, null)
  return (
    <>
      {cheatsEnabled && (
        <CheatContainer>
          <Button
            label={labels.exercises.cheat.succeed}
            onPress={() => cheat(SIMPLE_RESULTS.correct)}
            buttonTheme={BUTTONS_THEME.outlined}
          />
          <Button
            label={labels.exercises.cheat.fail}
            onPress={() => cheat(SIMPLE_RESULTS.incorrect)}
            buttonTheme={BUTTONS_THEME.outlined}
          />
        </CheatContainer>
      )}
    </>
  )
}
export default CheatMode
