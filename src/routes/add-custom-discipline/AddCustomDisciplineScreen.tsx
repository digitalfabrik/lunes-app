import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState, type JSX } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { QRCodeIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Loading from '../../components/Loading'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import { ContentSecondary } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import { loadDiscipline } from '../../hooks/useLoadDiscipline'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import QRCodeReaderOverlay from './components/QRCodeReaderOverlay'

const Container = styled.View`
  flex-direction: column;
  align-items: center;
`

const CustomDisciplineHeading = styled(HeadingText)`
  padding-top: ${props => props.theme.spacings.xl};
  text-align: center;
`

const Description = styled(ContentSecondary)`
  padding: ${props => `${props.theme.spacings.xl} ${props.theme.spacings.md} ${props.theme.spacings.xs}`};
`

const InputContainer = styled.View`
  width: 85%;
  margin-top: ${props => props.theme.spacings.lg};
  margin-bottom: ${props => props.theme.spacings.sm};
`

const HTTP_STATUS_CODE_FORBIDDEN = 403

type AddCustomDisciplineScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'AddCustomDiscipline'>
}

const AddCustomDiscipline = ({ navigation }: AddCustomDisciplineScreenProps): JSX.Element => {
  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showQRCodeOverlay, setShowQRCodeOverlay] = useState<boolean>(false)

  const [customDisciplines, setCustomDisciplines] = useStorage('customDisciplines')

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setErrorMessage('')
  }, [code])

  const submit = (): void => {
    if (customDisciplines.includes(code)) {
      setErrorMessage(getLabels().addCustomDiscipline.error.alreadyAdded)
      return
    }
    setLoading(true)
    loadDiscipline({ apiKey: code })
      .then(async () => setCustomDisciplines([...customDisciplines, code]))
      .then(navigation.goBack)
      .catch(error => {
        setErrorMessage(
          error.response?.status === HTTP_STATUS_CODE_FORBIDDEN
            ? getLabels().addCustomDiscipline.error.wrongCode
            : getLabels().addCustomDiscipline.error.technical,
        )
      })
      .finally(() => setLoading(false))
  }

  if (showQRCodeOverlay) {
    return <QRCodeReaderOverlay setVisible={setShowQRCodeOverlay} setCode={setCode} />
  }

  return (
    <RouteWrapper>
      <Loading isLoading={loading}>
        <Container>
          <CustomDisciplineHeading>{getLabels().addCustomDiscipline.heading}</CustomDisciplineHeading>
          <Description>{getLabels().addCustomDiscipline.description}</Description>
          <InputContainer>
            <CustomTextInput
              errorMessage={errorMessage}
              placeholder={getLabels().addCustomDiscipline.placeholder}
              value={code}
              onChangeText={setCode}
              rightContainer={
                <PressableOpacity onPress={() => setShowQRCodeOverlay(true)}>
                  <QRCodeIcon accessibilityLabel='qr-code-scanner' width={hp('3%')} height={hp('3%')} />
                </PressableOpacity>
              }
            />
          </InputContainer>
          <Button
            label={getLabels().addCustomDiscipline.submitLabel}
            buttonTheme={BUTTONS_THEME.contained}
            onPress={submit}
            disabled={code.length === 0}
          />
          <Button
            label={getLabels().addCustomDiscipline.backNavigation}
            buttonTheme={BUTTONS_THEME.outlined}
            onPress={navigation.goBack}
          />
        </Container>
      </Loading>
    </RouteWrapper>
  )
}

export default AddCustomDiscipline
