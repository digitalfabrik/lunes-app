import React, { ReactElement } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
`
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
    <LoadingContainer>
      {isLoading ? (
        <Indicator>
          <ActivityIndicator size='large' color={theme.colors.lunesBlack} testID={'loading'} />
        </Indicator>
      ) : (
        children
      )}
    </LoadingContainer>
  )
}

export default Loading
