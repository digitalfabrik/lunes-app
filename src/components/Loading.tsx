import React, { ReactElement } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors'
import styled from 'styled-components/native'

const Root = styled.View`
    flex: 1;
    align-items: center;
`;
const Indicator = styled.View`
    height: 50%;
    justify-content: center;
    align-items: center;
`;

export interface ILoadingProps {
  children: ReactElement
  isLoading: boolean
}

const Loading = ({ children, isLoading }: ILoadingProps) => (
  <Root>
    {isLoading ? (
      <Indicator>
        <ActivityIndicator size='large' color={COLORS.lunesBlack} />
      </Indicator>
    ) : (
      children
    )}
  </Root>
)
export default Loading