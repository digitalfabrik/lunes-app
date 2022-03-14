import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import Button from './Button'

const Container = styled.View`
  width: ${wp('90%')}px;
  margin: auto;
  margin-top: ${props => props.theme.spacings.xl};
  text-align: center;
  display: flex;
  align-items: center;
`

const ErrorText = styled.Text`
  padding: ${props => `${props.theme.spacings.md} ${props.theme.spacings.xl}`};
  font-size: ${props => props.theme.fonts.defaultFontSize};
`

interface ErrorMessageProps {
  error: Error | null
  refresh: () => void
}

const ErrorMessage = ({ error, refresh }: ErrorMessageProps): JSX.Element | null =>
  error && (
    <Container>
      <ErrorText>
        {error.message === 'Network Error' ? `${labels.general.error.noWifi} (${error.message})` : error.message}
      </ErrorText>
      <Button label={labels.general.error.retryButton} buttonTheme={BUTTONS_THEME.outlined} onPress={refresh} />
    </Container>
  )

export default ErrorMessage
