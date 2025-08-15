import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { NoInternetConnectionIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import { NetworkError } from '../constants/endpoints'
import theme from '../constants/theme'
import { getLabels } from '../services/helpers'
import Button from './Button'
import RoundedBackground from './RoundedBackground'
import { Content } from './text/Content'

const Container = styled.View`
  width: ${wp('80%')}px;
  margin: auto;
  margin-top: ${props => props.theme.spacings.md};
  text-align: center;
  display: flex;
  align-items: center;
`
const ErrorTitle = styled.Text`
  padding: ${props => `${props.theme.spacings.md} ${props.theme.spacings.xl}`} 0 ${props => props.theme.spacings.xl};
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.primary};
  text-align: center;
`
export const ErrorText = styled(Content)<{ centered?: boolean }>`
  padding: ${props => `${props.theme.spacings.md} ${props.theme.spacings.xl}`};
  text-align: ${props => (props.centered ? 'center' : 'left')};
`
const NetworkErrorWrapper = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  align-items: center;
`
const IconStyle = styled.View`
  width: 33%;
  height: auto;
  align-items: center;
`

type ErrorMessageProps = {
  error: Error | null
  refresh: () => void
  contained?: boolean
}

const ErrorMessage = ({ error, refresh, contained }: ErrorMessageProps): JSX.Element | null => {
  if (!error) {
    return null
  }

  const message =
    error.message === NetworkError ? `${getLabels().general.error.noWifi} (${error.message})` : error.message
  if (contained) {
    return (
      <Container>
        <ErrorText>{message}</ErrorText>
        <Button label={getLabels().general.error.retryButton} buttonTheme={BUTTONS_THEME.outlined} onPress={refresh} />
      </Container>
    )
  }

  return (
    <NetworkErrorWrapper>
      <RoundedBackground color={theme.colors.lightGreyBackground}>
        <Container>
          {error.message === NetworkError && (
            <IconStyle>
              <NoInternetConnectionIcon testID='no-internet-icon' />
            </IconStyle>
          )}
          <ErrorTitle>{getLabels().general.error.somethingWentWrong}</ErrorTitle>
          <ErrorText centered>{message}</ErrorText>
        </Container>
      </RoundedBackground>
      <Button label={getLabels().general.error.retryButton} buttonTheme={BUTTONS_THEME.contained} onPress={refresh} />
    </NetworkErrorWrapper>
  )
}

export default ErrorMessage
