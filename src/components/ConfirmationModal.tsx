import { CloseIcon } from '../../assets/images'
import { BUTTONS_THEME } from '../constants/data'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import AsyncStorage from '../services/AsyncStorage'
import Button from './Button'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    marginTop: 0,
    backgroundColor: COLORS.lunesOverlay
  },
  modal: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('85%'),
    borderRadius: 4,
    position: 'relative',
    paddingVertical: 31
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24
  },
  message: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    width: wp('60%'),
    marginBottom: 31,
    paddingTop: 31
  },
  lightLabel: {
    color: COLORS.lunesWhite,
    fontSize: wp('4%'),
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    letterSpacing: 0.4
  },
  darkLabel: {
    color: COLORS.lunesBlack,
    fontSize: wp('4%'),
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    letterSpacing: 0.4
  }
})

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
    <Modal testID='modal' visible={visible} transparent animationType='fade' style={styles.container}>
      <View style={[styles.container, styles.overlay]}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.message}>{labels.exercises.cancelModal.cancelAsk}</Text>
          <Button onPress={closeModal} buttonTheme={BUTTONS_THEME.dark}>
            <Text style={styles.lightLabel}>{labels.exercises.cancelModal.continue}</Text>
          </Button>

          <Button onPress={goBack} buttonTheme={BUTTONS_THEME.light}>
            <Text style={styles.darkLabel}>{labels.exercises.cancelModal.cancel}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationModal
