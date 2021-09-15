import React from 'react'
import { CloseIcon } from '../../assets/images'
import Button from './Button'
import { BUTTONS_THEME } from '../constants/data'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AsyncStorage from '../services/AsyncStorage'
import labels from '../constants/labels.json'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import styled from 'styled-components/native'
import { Color } from 'react-native-svg'
import { Modal } from 'react-native'

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    background-color: ${COLORS.lunesOverlay};
`;
const ModalStyle = styled.View`
    background-color: ${COLORS.white};
    align-items: center;
    justify-content: center;
    width: ${wp('85%')};
    border-radius: 4;
    position: relative;
    padding-top: 31;
    padding-bottom: 31;
`;
const CloseIconStyle = styled.TouchableOpacity`
    position: absolute;
    top: 8;
    right: 8;
    width: 24;
    height: 24;
`;
const Message = styled.Text`
    text-align: center;
    font-size: ${wp('5%')};
    color: ${COLORS.lunesGreyDark};
    font-family: 'SourceSansPro-SemiBold';
    width: ${wp('60%')};
    margin-bottom: 31;
    padding-top: 31;
`;
const LightLabel = styled.Text`
    color: ${COLORS.lunesWhite};
    font-size: ${wp('4%')};
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    font-family: 'SourceSansPro-SemiBold';
    letter-spacing: 0.4;
`;
const DarkLabel = styled.Text`
    color: ${COLORS.lunesBlack};
    font-size: ${wp('4%')};
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    font-family: 'SourceSansPro-SemiBold';
    letter-spacing: 0.4;
`;

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
    const { disciplineID, disciplineTitle, disciplineIcon, trainingSetId, trainingSet, documentsLength } = route.params.extraParams
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
      <Container>
        <ModalStyle>
          <CloseIconStyle onPress={closeModal}>
            <CloseIcon />
          </CloseIconStyle>
          <Message>{labels.exercises.cancelModal.cancelAsk}</Message>
          <Button onPress={closeModal} buttonTheme={BUTTONS_THEME.dark}>
            <LightLabel>{labels.exercises.cancelModal.continue}</LightLabel>
          </Button>
          <Button onPress={goBack} buttonTheme={BUTTONS_THEME.light}>
            <DarkLabel>{labels.exercises.cancelModal.cancel}</DarkLabel>
          </Button>
        </ModalStyle>
      </Container>
    </Modal>
  )
}
export default ConfirmationModal