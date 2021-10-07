import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import Button from '../components/Button'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
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

const StyledTextInput = styled.TextInput`
  font-size: ${props => props.theme.fonts.largeFontSize}
  font-weight: normal;
  letter-spacing: 0.11px;
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${prop => prop.theme.colors.lunesBlack};
  width: 80%;
  border: 1px solid ${props => props.theme.colors.lunesGreyDark};
  border-radius: 4px;
  margin: ${hp('8%')}px;
  padding-left: 15px;
`

const LightLabel = styled.Text`
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

const DarkLabel = styled.Text`
  color: ${props => props.theme.colors.lunesWhite};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

interface AddAreaScreenPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'AddArea'>
}

const AddAreaScreen = ({ navigation }: AddAreaScreenPropsType) => {
  const [code, setCode] = useState<string>('')
  const [areas, setAreas] = useState<string[]>([])
  AsyncStorage.getIndividualAreas()
    .then(res => {
      setAreas(res)
    })
    .catch(err => {
      console.log('Error while fetching areas ', err)
    })

  const submit = (): void => {
    // get from server if it is a valid code
    const serverResponse = true
    if (serverResponse) {
      setAreas(areas => [...areas, code])
      AsyncStorage.setIndividualAreas(areas)
        .then(() => {
          setCode('')
        })
        .catch(err => {
          console.log('Error while saving individual areas: ', err)
        })
    } else {
      console.log('Code does not exist -> Should be displayed to user')
    }
  }

  return (
    <Container>
      <Heading>{labels.addArea.heading}</Heading>
      <Description>{labels.addArea.description}</Description>
      <StyledTextInput placeholder={labels.addArea.placeholder} value={code} onChangeText={text => setCode(text)} />
      <Button buttonTheme={BUTTONS_THEME.dark} onPress={submit} disabled={code.length === 0}>
        <DarkLabel>{labels.addArea.submitLabel}</DarkLabel>
      </Button>
      <Button buttonTheme={BUTTONS_THEME.light} onPress={navigation.goBack}>
        <LightLabel>{labels.addArea.backNavigation}</LightLabel>
      </Button>
    </Container>
  )
}

export default AddAreaScreen
