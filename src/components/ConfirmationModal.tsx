import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Modal } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'
import Button from './Button'

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.lunesOverlay};
`
const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  width: ${wp('85%')}px;
  border-radius: 4px;
  position: relative;
  padding-top: 31px;
  padding-bottom: 31px;
`
const Icon = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
`
const Message = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  width: ${wp('60%')}px;
  margin-bottom: 31px;
  padding-top: 31px;
`
const Label = styled.Text<{ light: boolean }>`
  color: ${props => (props.light ? props.theme.colors.lunesWhite : props.theme.colors.lunesBlack)};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  text-align: center;
  text-transform: uppercase;
  font-family: ${props => props.theme.fonts.contentFontBold};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
`

export interface ConfirmationModalPropsType {
  visible: boolean
  setIsModalVisible: Function
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
}

const ConfirmationModal = ({
  navigation,
  route,
  visible,
  setIsModalVisible
}: ConfirmationModalPropsType): JSX.Element => {
  const closeModal = (): void => setIsModalVisible(false)
  const goBack = (): void => {
    setIsModalVisible(false)
    AsyncStorage.clearSession().catch(e => console.error(e))
    const { disciplineID, disciplineTitle, disciplineIcon, trainingSetId, trainingSet, documentsLength } =
      route.params.extraParams
    const extraParams = {
      extraParams: {
        disciplineID: disciplineID,
        disciplineTitle: disciplineTitle,
        disciplineIcon: disciplineIcon,
        trainingSetId: trainingSetId,
        trainingSet: trainingSet,
        documentsLength: documentsLength
      }
    }
    navigation.navigate('Exercises', extraParams)
  }
  return (
    <Modal testID='modal' visible={visible} transparent animationType='fade'>
      <Overlay>
        <ModalContainer>
          <Icon onPress={closeModal}>
            <CloseIcon />
          </Icon>
          <Message>{labels.exercises.cancelModal.cancelAsk}</Message>
          <Button onPress={closeModal} buttonTheme={BUTTONS_THEME.dark}>
            <Label light>{labels.exercises.cancelModal.continue}</Label>
          </Button>
          <Button onPress={goBack} buttonTheme={BUTTONS_THEME.light}>
            <Label light={false}>{labels.exercises.cancelModal.cancel}</Label>
          </Button>
        </ModalContainer>
      </Overlay>
    </Modal>
  )
}
export default ConfirmationModal
