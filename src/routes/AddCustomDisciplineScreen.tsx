import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../components/Button'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import withCustomDisciplines from '../hocs/withCustomDisciplines'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'

const Container = styled.View`
  flex-direction: column;
  align-items: center;
`

const Heading = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.headingFontSize};
  padding-top: 40px;
`

const Description = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium}
  padding: 10px 0;
`

const StyledTextInput = styled.TextInput<{ errorMessage: string }>`
  font-size: ${props => props.theme.fonts.largeFontSize}
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  letter-spacing: 0.11px;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.lunesBlack};
  width: 80%;
  border: 1px solid ${props =>
    props.errorMessage ? props.theme.colors.lunesFunctionalIncorrectDark : props.theme.colors.lunesGreyDark};
  border-radius: 4px;
  margin-top: ${hp('8%')}px;
  padding-left: 15px;
`

const ErrorContainer = styled.View`
  margin-bottom: ${hp('4%')}px;
  width: 80%;
  height: 10%;
`

const ErrorText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize}
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.lunesFunctionalIncorrectDark};
`

const LightLabel = styled.Text`
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
`

const DarkLabel = styled.Text<{ disabled: boolean }>`
  color: ${props => (props.disabled ? props.theme.colors.lunesBlackLight : props.theme.colors.lunesWhite)};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
`

interface AddCustomDisciplineScreenPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'AddCustomDiscipline'>
  customDisciplines: string[]
}

const AddCustomDiscipline = ({ navigation, customDisciplines }: AddCustomDisciplineScreenPropsType): JSX.Element => {
  const [code, setCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const showErrorMessage = (message: string): void => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
      setCode('')
    }, 5000)
  }

  const submit = (): void => {
    if (customDisciplines.includes(code)) {
      showErrorMessage(labels.addCustomDiscipline.error.alreadyAdded)
    } else {
      const serverResponse = true // TODO LUN-190 make server request here, when api is finished
      if (!serverResponse) {
        showErrorMessage(labels.addCustomDiscipline.error.wrongCode)
      } else {
        AsyncStorage.setCustomDisciplines([...customDisciplines, code])
          .then(() => {
            navigation.navigate('Home')
          })
          .catch(() => {
            showErrorMessage(labels.addCustomDiscipline.error.technical)
          })
      }
    }
  }

  return (
    <Container>
      <Heading>{labels.addCustomDiscipline.heading}</Heading>
      <Description>{labels.addCustomDiscipline.description}</Description>
      <StyledTextInput
        errorMessage={errorMessage}
        placeholder={labels.addCustomDiscipline.placeholder}
        value={code}
        onChangeText={setCode}
      />
      <ErrorContainer>{<ErrorText>{errorMessage}</ErrorText>}</ErrorContainer>
      <Button buttonTheme={BUTTONS_THEME.dark} onPress={submit} disabled={code.length === 0}>
        <DarkLabel disabled={code.length === 0}>{labels.addCustomDiscipline.submitLabel}</DarkLabel>
      </Button>
      <Button buttonTheme={BUTTONS_THEME.light} onPress={navigation.goBack}>
        <LightLabel>{labels.addCustomDiscipline.backNavigation}</LightLabel>
      </Button>
    </Container>
  )
}

export default withCustomDisciplines(AddCustomDiscipline)
