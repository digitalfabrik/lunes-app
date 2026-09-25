import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import CustomTextInput from '../components/CustomTextInput'
import RouteWrapper from '../components/RouteWrapper'
import { ContentSecondary } from '../components/text/Content'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Description = styled(ContentSecondary)`
  text-align: center;
  padding: ${props => `${props.theme.spacings.xl} ${props.theme.spacings.md}`};
`

const InputContainer = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

type ActivationCodeEntryScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'ActivationCodeEntry'>
}

const ActivationCodeEntryScreen = ({ navigation }: ActivationCodeEntryScreenProps): ReactElement => {
  const [code, setCode] = useState<string>('')

  const submit = (): void => {
    const trimmedCode = code.trim()
    if (trimmedCode.length === 0) {
      return
    }
    navigation.replace('Activation', { code: trimmedCode })
  }

  return (
    <RouteWrapper shouldSetBottomInset>
      <Description>{getLabels().activationCodeEntry.description}</Description>
      <InputContainer>
        <CustomTextInput
          value={code}
          onChangeText={setCode}
          placeholder={getLabels().activationCodeEntry.placeholder}
          onSubmitEditing={submit}
          autoCapitalize='characters'
          autoCorrect={false}
          returnKeyType='done'
        />
      </InputContainer>
    </RouteWrapper>
  )
}

export default ActivationCodeEntryScreen
