import React, { ReactElement } from 'react'
import { ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'

import { COLORS } from '../constants/theme/colors'

const Indicator = styled.View`
  height: 50%;
  justify-content: center;
  align-items: center;
`

export interface ILoadingProps {
  children?: ReactElement
  isLoading: boolean
}

const Loading = ({ children, isLoading }: ILoadingProps): ReactElement => (
  <View>
    {isLoading ? (
      <Indicator>
        <ActivityIndicator size='large' color={COLORS.lunesBlack} />
      </Indicator>
    ) : (
      children
    )}
  </View>
)
export default Loading
