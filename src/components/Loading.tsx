import React, { ReactElement } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { COLORS } from '../constants/theme/colors'

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
`
const Indicator = styled.View`
  height: 50%;
  justify-content: center;
  align-items: center;
`

export interface ILoadingProps {
  children: ReactElement
  isLoading: boolean
}

const Loading = ({ children, isLoading }: ILoadingProps): ReactElement => (
  <LoadingContainer>
    {isLoading ? (
      <Indicator>
        <ActivityIndicator size='large' color={COLORS.lunesBlack} />
      </Indicator>
    ) : (
      children
    )}
  </LoadingContainer>
)
export default Loading
