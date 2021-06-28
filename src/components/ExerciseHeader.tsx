import React, { useEffect, useLayoutEffect, useState } from 'react'
import Modal from './Modal'
import { BackHandler, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { CloseButton } from '../../assets/images'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { COLORS } from '../constants/colors'
import labels from '../constants/labels.json'
import { ProgressBar } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { RouteProp } from '@react-navigation/native'

const HeaderStyle = StyleSheet.create({
  headerText: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100
  },
  progressBar: {
    backgroundColor: COLORS.lunesBlackUltralight
  }
})

interface ExerciseHeaderPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  currentWord: number
  numberOfWords: number
}

function ExerciseHeader({ navigation, route, currentWord, numberOfWords }: ExerciseHeaderPropsType) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={HeaderStyle.headerLeft}>
            <CloseButton />
            <Text style={HeaderStyle.title}>{labels.general.header.cancelExercise}</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={HeaderStyle.headerText}>{`${currentWord + 1} ${
            labels.general.header.of
          } ${numberOfWords}`}</Text>
        )
      }),
    [navigation, currentWord, numberOfWords, setIsModalVisible]
  )

  useEffect(() => {
    const showModal = () => {
      setIsModalVisible(true)
      return true
    }
    const bEvent = BackHandler.addEventListener('hardwareBackPress', showModal)
    return () => bEvent.remove()
  }, [])

  return (
    <>
      <ProgressBar
        progress={numberOfWords > 0 ? currentWord / numberOfWords : 0}
        color={COLORS.lunesGreenMedium}
        style={HeaderStyle.progressBar}
        accessibilityComponentType
        accessibilityTraits
      />

      <Modal visible={isModalVisible} setIsModalVisible={setIsModalVisible} navigation={navigation} route={route} />
    </>
  )
}

export default ExerciseHeader
