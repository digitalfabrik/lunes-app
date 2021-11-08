import React, { ReactElement } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

const Indicator = styled.View`
  height: 50%;
  justify-content: center;
  align-items: center;
`

interface ILoadingProps {
  children?: ReactElement
  isLoading: boolean
}

const Loading = ({ children, isLoading }: ILoadingProps): ReactElement => {
  const theme = useTheme()
  return (
    <>
      {isLoading ? (
        <Indicator>
          <ActivityIndicator size='large' color={theme.colors.lunesBlack} testID={'loading'} />
        </Indicator>
      ) : (
        children
      )}
    </>
  )
}

export default Loading
