import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { NoInternetConnectionIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import { NetworkError } from '../constants/endpoints'
import labels from '../constants/labels.json'
import Button from './Button'

const Container = styled.View`
  width: ${wp('80%')}px;
  margin: auto;
  margin-top: ${props => props.theme.spacings.md};
  text-align: center;
  display: flex;
  align-items: center;
`
const ErrorTitle = styled.Text`
  padding: ${props => `${props.theme.spacings.md} ${props.theme.spacings.xl}`} 0 ${props => props.theme.spacings.xl}};
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.primary};
  text-align: center;
`
const ErrorText = styled.Text<{ centered?: boolean }>`
  padding: ${props => `${props.theme.spacings.md} ${props.theme.spacings.xl}`};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  text-align: ${props => (props.centered ? 'center' : 'left')};
`
const NetworkErrorWrapper = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  align-items: center;
`
const IconStyle = styled.View`
  width: 33%;
  height: auto;
  align-items: center;
`
const UpperSection = styled.View`
  width: 140%;
  height: 67%;
  background-color: ${props => props.theme.colors.networkErrorBackground};
  border-bottom-left-radius: ${hp('60%')}px;
  border-bottom-right-radius: ${hp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.xxl};
  justify-content: center;
  align-items: center;
  text-align: center;
`

interface ErrorMessageProps {
  error: Error | null
  refresh: () => void
  contained?: boolean
}

const ErrorMessage = ({ error, refresh, contained }: ErrorMessageProps): JSX.Element | null =>
  error &&
  (!contained && error.message === NetworkError ? (
    <NetworkErrorWrapper>
      <UpperSection>
        <Container>
          <IconStyle>
            <NoInternetConnectionIcon testID='no-internet-icon' />
          </IconStyle>
          <ErrorTitle>{labels.general.error.somethingWentWrong}</ErrorTitle>
          <ErrorText centered>
            {labels.general.error.noWifi} ({error.message})
          </ErrorText>
        </Container>
      </UpperSection>
      <Button label={labels.general.error.retryButton} buttonTheme={BUTTONS_THEME.contained} onPress={refresh} />
    </NetworkErrorWrapper>
  ) : (
    <Container>
      <ErrorText>
        {error.message === NetworkError ? `${labels.general.error.noWifi} (${error.message})` : error.message}
      </ErrorText>
      <Button label={labels.general.error.retryButton} buttonTheme={BUTTONS_THEME.outlined} onPress={refresh} />
    </Container>
  ))

export default ErrorMessage
