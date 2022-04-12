import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { QRCodeIcon } from '../../../assets/images'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { ContentError, ContentSecondary } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import labels from '../../constants/labels.json'
import { loadGroupInfo } from '../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
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
  padding: ${props => `${props.theme.spacings.xs} 0`};
`

const InputContainer = styled.View<{ errorMessage: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  border: 1px solid ${props => (props.errorMessage ? props.theme.colors.incorrect : props.theme.colors.text)};
  border-radius: 4px;
  margin-top: ${props => props.theme.spacings.lg};
  padding: ${props => `0 ${props.theme.spacings.sm}`};
  height: ${hp('8%')}px;
`

const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.largeFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: 0.11px;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.primary};
  width: 90%;
`

const ErrorContainer = styled.View`
  margin-bottom: ${props => props.theme.spacings.sm};
  width: 80%;
  height: 10%;
`

const HTTP_STATUS_CODE_FORBIDDEN = 403

interface AddCustomDisciplineScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'AddCustomDiscipline'>
}

const AddCustomDiscipline = ({ navigation }: AddCustomDisciplineScreenProps): JSX.Element => {
  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const theme = useTheme()
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
    loadGroupInfo(code)
      .then(async () => AsyncStorage.setCustomDisciplines([...customDisciplines, code]))
      .then(() => navigation.goBack())
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
        <Container>
          <CustomDisciplineHeading>{labels.addCustomDiscipline.heading}</CustomDisciplineHeading>
          <Description>{labels.addCustomDiscipline.description}</Description>
          <InputContainer errorMessage={errorMessage}>
            <StyledTextInput
              placeholder={labels.addCustomDiscipline.placeholder}
              placeholderTextColor={theme.colors.placeholder}
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity onPress={() => setShowQRCodeOverlay(true)}>
              <QRCodeIcon accessibilityLabel='qr-code-scanner' width={wp('6%')} height={wp('6%')} />
            </TouchableOpacity>
          </InputContainer>

          <ErrorContainer>
            <ContentError>{errorMessage}</ContentError>
          </ErrorContainer>
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
      )}
    </Loading>
  )
}

export default AddCustomDiscipline
