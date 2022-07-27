import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { QRCodeIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CustomTextInput from '../../components/CustomTextInput'
import Loading from '../../components/Loading'
import { ContentSecondary } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import labels from '../../constants/labels.json'
import { loadDiscipline } from '../../hooks/useLoadDiscipline'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import QRCodeReaderOverlay from './components/QRCodeReaderOverlay'
import RouteWrapper from '../../components/RouteWrapper'

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

interface AddCustomDisciplineScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'AddCustomDiscipline'>
}

const AddCustomDiscipline = ({ navigation }: AddCustomDisciplineScreenProps): JSX.Element => {
  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showQRCodeOverlay, setShowQRCodeOverlay] = useState<boolean>(false)

  const { data: customDisciplines } = useReadCustomDisciplines()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setErrorMessage('')
  }, [code])

  const submit = (): void => {
    if (!customDisciplines) {
      return
    }
    if (customDisciplines.includes(code)) {
      setErrorMessage(labels.addCustomDiscipline.error.alreadyAdded)
      return
    }
    setLoading(true)
    loadDiscipline({ apiKey: code })
      .then(async () => AsyncStorage.setCustomDisciplines([...customDisciplines, code]))
      .then(navigation.goBack)
      .catch(error => {
        setErrorMessage(
          error.response?.status === HTTP_STATUS_CODE_FORBIDDEN
            ? labels.addCustomDiscipline.error.wrongCode
            : labels.addCustomDiscipline.error.technical
        )
      })
      .finally(() => setLoading(false))
  }

  if (showQRCodeOverlay) {
    return <QRCodeReaderOverlay setVisible={setShowQRCodeOverlay} setCode={setCode} />
  }

  return (
    <Loading isLoading={loading}>
      {customDisciplines && (
        <RouteWrapper>
          <Container>
            <CustomDisciplineHeading>{labels.addCustomDiscipline.heading}</CustomDisciplineHeading>
            <Description>{labels.addCustomDiscipline.description}</Description>
            <InputContainer>
              <CustomTextInput
                errorMessage={errorMessage}
                placeholder={labels.addCustomDiscipline.placeholder}
                value={code}
                onChangeText={setCode}
                rightContainer={
                  <TouchableOpacity onPress={() => setShowQRCodeOverlay(true)}>
                    <QRCodeIcon accessibilityLabel='qr-code-scanner' width={wp('6%')} height={wp('6%')} />
                  </TouchableOpacity>
                }
              />
            </InputContainer>
            <Button
              label={labels.addCustomDiscipline.submitLabel}
              buttonTheme={BUTTONS_THEME.contained}
              onPress={submit}
              disabled={code.length === 0}
            />
            <Button
              label={labels.addCustomDiscipline.backNavigation}
              buttonTheme={BUTTONS_THEME.outlined}
              onPress={navigation.goBack}
            />
          </Container>
        </RouteWrapper>
      )}
    </Loading>
  )
}

export default AddCustomDiscipline
