import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Button from '../components/Button'
import RouteWrapper from '../components/RouteWrapper'
import { ContentText, ContentTextBold } from '../components/text/Content'
import { HeadingText } from '../components/text/Heading'
import { BUTTONS_THEME } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
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

const CodeLabel = styled(ContentText)`
  margin-right: ${props => props.theme.spacings.xs};
`

const ActivationScreen = ({ route, navigation }: ActivationScreenProps): ReactElement => {
  const { code } = route.params
  const { activation } = getLabels()

  // TODO: Validate accessKey and add the content once #1534 is ready.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleAdd = (): void => {}

  const handleCancel = (): void => {
    navigation.navigate('BottomTabNavigator', { screen: 'HomeTab', params: { screen: 'Home' } })
  }

  return (
    <RouteWrapper shouldSetTopInset shouldSetBottomInset>
      <Root>
        <Title>{activation.title}</Title>
        <CodeContainer>
          <CodeLabel>{activation.code}:</CodeLabel>
          <ContentTextBold testID='activation-code'>{code}</ContentTextBold>
        </CodeContainer>
        <Button
          label={activation.add}
          onPress={handleAdd}
          buttonTheme={BUTTONS_THEME.contained}
          testID='activation-add-button'
        />
        <Button
          label={activation.cancel}
          onPress={handleCancel}
          buttonTheme={BUTTONS_THEME.outlined}
          testID='activation-cancel-button'
        />
      </Root>
    </RouteWrapper>
  )
}

export default ActivationScreen
