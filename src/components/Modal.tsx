import React from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { IConfirmationModalProps } from '../interfaces/exercise'
import { CloseIcon } from '../../assets/images'
import Button from './Button'
import { BUTTONS_THEME } from '../constants/data'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors'
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

const ConfirmationModal = ({ visible, setIsModalVisible, navigation, extraParams }: IConfirmationModalProps) => {
  const closeModal = () => setIsModalVisible(false)

  const goBack = () => {
    setIsModalVisible(false)
    AsyncStorage.removeItem('session')
    navigation.navigate('Exercises', { extraParams })
  }

  return (
    <Modal testID='modal' visible={visible} transparent animationType='fade' style={styles.container}>
      <View style={[styles.container, styles.overlay]}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.message}>Do you really want to end this session?</Text>
          <Button onPress={closeModal} theme={BUTTONS_THEME.dark}>
            <Text style={styles.lightLabel}>continue</Text>
          </Button>

          <Button onPress={goBack} theme={BUTTONS_THEME.light}>
            <Text style={styles.darkLabel}>end</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationModal
