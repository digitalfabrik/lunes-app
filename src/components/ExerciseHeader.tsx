import React, { useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { BackHandler } from 'react-native'
import { CloseButton } from '../../assets/images'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { COLORS } from '../constants/theme/colors'
import labels from '../constants/labels.json'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import styled from 'styled-components/native'

const HeaderText = styled.Text`
    font-size: ${wp('4%')};
    font-family: 'SourceSansPro-Regular';
    color: ${COLORS.lunesGreyMedium};
`
const Title = styled.Text`
    color: ${COLORS.lunesBlack};
    font-family: 'SourceSansPro-SemiBold';
    font-size: ${wp('4%')};
    text-transform: uppercase;
    font-weight: 600;
    margin-left: 15;
`;

const ProgressBar = styled(RNProgressBar)`
   background-color: ${COLORS.lunesBlackUltralight};
`;

const HeaderLeft = styled.TouchableOpacity`
    padding-left: 15;
    flex-direction: row;
    align-items: center;
`

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
          <HeaderLeft onPress={() => setIsModalVisible(true)}>
            <CloseButton />
            <Title>{labels.general.header.cancelExercise}</Title>
          </HeaderLeft>
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
    const showModal = (): boolean => {
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
        accessibilityComponentType
        accessibilityTraits
      />
      <ConfirmationModal visible={isModalVisible} setIsModalVisible={setIsModalVisible} navigation={navigation} route={route} />
    </>
  )
}
export default ExerciseHeader