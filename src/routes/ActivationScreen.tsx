import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Button from '../components/Button'
import Loading from '../components/Loading'
import RouteWrapper from '../components/RouteWrapper'
import { ContentError, ContentText, ContentTextBold } from '../components/text/Content'
import { HeadingText } from '../components/text/Heading'
import { BUTTONS_THEME } from '../constants/data'
import useRedeemContentArea from '../hooks/useRedeemContentArea'
import { RoutesParams } from '../navigation/NavigationTypes'
import { resetToHome } from '../navigation/navigationHelpers'
import { getLabels } from '../services/helpers'

type ActivationScreenProps = {
  route: RouteProp<RoutesParams, 'Activation'>
  navigation: StackNavigationProp<RoutesParams, 'Activation'>
}

const Root = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 ${props => props.theme.spacings.lg};
`

const Title = styled(HeadingText)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.md};
`

const CodeContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacings.lg};
`

const ErrorText = styled(ContentError)`
  margin-bottom: ${props => props.theme.spacings.sm};
  text-align: center;
`

const CodeLabel = styled(ContentText)`
  margin-right: ${props => props.theme.spacings.xs};
`

const ActivationScreen = ({ route, navigation }: ActivationScreenProps): ReactElement => {
  const { code } = route.params
  const { activation } = getLabels()
  const { redeem, errorMessage, isRedeeming } = useRedeemContentArea(navigation)

  const navigateToHome = (): void => {
    resetToHome(navigation)
  }

  return (
    <RouteWrapper shouldSetTopInset shouldSetBottomInset>
      <Loading isLoading={isRedeeming}>
        <Root>
          <Title>{activation.title}</Title>
          <CodeContainer>
            <CodeLabel>{activation.code}:</CodeLabel>
            <ContentTextBold testID='activation-code'>{code}</ContentTextBold>
          </CodeContainer>
          {errorMessage.length > 0 && (
            <ErrorText accessibilityRole='alert' accessibilityLiveRegion='polite' testID='activation-error'>
              {errorMessage}
            </ErrorText>
          )}
          <Button
            label={activation.add}
            onPress={() => redeem(code)}
            buttonTheme={BUTTONS_THEME.contained}
            testID='activation-add-button'
          />
          <Button
            label={activation.cancel}
            onPress={navigateToHome}
            buttonTheme={BUTTONS_THEME.outlined}
            testID='activation-cancel-button'
          />
        </Root>
      </Loading>
    </RouteWrapper>
  )
}

export default ActivationScreen
