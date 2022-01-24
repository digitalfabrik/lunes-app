import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import Button from './Button'

const Container = styled.View`
  width: ${wp('90%')}px;
  margin: auto;
  margin-top: ${wp('10%')}px;
  text-align: center;
  display: flex;
  align-items: center;
`

const ErrorText = styled.Text`
  padding: 20px 40px;
  font-size: ${props => props.theme.fonts.defaultFontSize};
`

interface ErrorMessagePropsType {
  error: Error | null
  refresh: () => void
}

const ErrorMessage = ({ error, refresh }: ErrorMessagePropsType): JSX.Element | null => {
  return (
    error && (
      <Container>
        <ErrorText>
          {error.message === 'Network Error' ? `${labels.general.error.noWifi} (${error.message})` : error.message}
        </ErrorText>
        <Button label={labels.general.error.retryButton} buttonTheme={BUTTONS_THEME.outlined} onPress={refresh} />
      </Container>
    )
  )
}

export default ErrorMessage
