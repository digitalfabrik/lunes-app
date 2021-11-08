import React from 'react'
import { Text } from 'react-native'
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
        <>
          {error.message === 'Network Error' ? (
            <ErrorText>
              {labels.general.error.noWifi} ({error?.message})
            </ErrorText>
          ) : (
            <ErrorText>({error?.message})</ErrorText>
          )}
          <Button buttonTheme={BUTTONS_THEME.light} onPress={refresh}>
            <Text>{labels.general.error.retryButton}</Text>
          </Button>
        </>
      </Container>
    )
  )
}

export default ErrorMessage
