import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { BackHandler } from 'react-native'
import { CloseButton } from '../../assets/images'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { COLORS } from '../constants/colors'
import labels from '../constants/labels.json'
import { ProgressBar } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import styled from 'styled-components/native'

const HeaderText = styled.Text`
    font-size: ${wp('4%')};
    font-weight: normal;
    font-family: 'SourceSansPro-Regular';
    color: ${COLORS.lunesGreyMedium};
`;
const TextTitle = styled.Text`
    color: ${COLORS.lunesBlack};
    font-family: 'SourceSansPro-SemiBold';
    font-size: ${wp('4%')};
    text-transform: uppercase;
    font-weight: 600;
    margin-left: 15;
`;
const ProgressBarStyle = styled(ProgressBar)`
   background-color: ${COLORS.lunesBlackUltralight};
`;

const HeaderLeftTouchableOpacity = styled.TouchableOpacity`
    padding-left: 15;
    flex-direction: row;
    align-items: center;
    z-index: 100;
`;

interface ExerciseHeaderPropsType {
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'>
  currentWord: number
  numberOfWords: number
}

const ExerciseHeader = ({ navigation, route, currentWord, numberOfWords }: ExerciseHeaderPropsType): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => (
          <HeaderLeftTouchableOpacity onPress={() => setIsModalVisible(true)} >
            <CloseButton />
            <TextTitle>{labels.general.header.cancelExercise}</TextTitle>
          </HeaderLeftTouchableOpacity>
        ),
        headerRight: () => (
          <HeaderText>{`${currentWord + 1} ${
            labels.general.header.of
          } ${numberOfWords}`}</HeaderText>
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
      <ProgressBarStyle
        progress={numberOfWords > 0 ? currentWord / numberOfWords : 0}
        color={COLORS.lunesGreenMedium}
        accessibilityComponentType
        accessibilityTraits
      />
      <Modal visible={isModalVisible} setIsModalVisible={setIsModalVisible} navigation={navigation} route={route} />
    </>
  )
}
export default ExerciseHeader