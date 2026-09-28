import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import Button from '../components/Button'
import CustomTextInput from '../components/CustomTextInput'
import Loading from '../components/Loading'
import RouteWrapper from '../components/RouteWrapper'
import { ContentSecondary } from '../components/text/Content'
import { BUTTONS_THEME } from '../constants/data'
import useRedeemContentArea from '../hooks/useRedeemContentArea'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Description = styled(ContentSecondary)`
  text-align: center;
  padding: ${props => `${props.theme.spacings.xl} ${props.theme.spacings.md}`};
`

const InputContainer = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${props => props.theme.spacings.md};
`

// Codes never contain whitespace, but copying them often brings along surrounding spaces or line breaks
const removeWhitespace = (text: string): string => text.replace(/\s/g, '')

type ActivationCodeEntryScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'ActivationCodeEntry'>
}

const ActivationCodeEntryScreen = ({ navigation }: ActivationCodeEntryScreenProps): ReactElement => {
  const [code, setCode] = useState<string>('')
  const { redeem, errorMessage, isRedeeming } = useRedeemContentArea(navigation)

  const submit = async (): Promise<void> => {
    if (code.length === 0) {
      return
    }
    await redeem(code)
  }

  return (
    <RouteWrapper shouldSetBottomInset>
      <Loading isLoading={isRedeeming}>
        <Description>{getLabels().activationCodeEntry.description}</Description>
        <InputContainer>
          <CustomTextInput
            value={code}
            onChangeText={text => setCode(removeWhitespace(text))}
            placeholder={getLabels().activationCodeEntry.placeholder}
            onSubmitEditing={submit}
            errorMessage={errorMessage.length > 0 ? errorMessage : undefined}
            autoCapitalize='characters'
            autoCorrect={false}
            returnKeyType='done'
          />
        </InputContainer>
        <ButtonContainer>
          <Button
            label={getLabels().activation.add}
            onPress={submit}
            disabled={code.length === 0}
            buttonTheme={BUTTONS_THEME.contained}
            testID='activation-code-entry-add-button'
          />
        </ButtonContainer>
      </Loading>
    </RouteWrapper>
  )
}

export default ActivationCodeEntryScreen
