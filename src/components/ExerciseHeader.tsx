import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { ProgressBar as RNProgressBar } from 'react-native-paper'
import styled from 'styled-components/native'

import { CloseButton } from '../../assets/images'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import ConfirmationModal from './ConfirmationModal'

const HeaderText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.lunesGreyMedium};
`

const Title = styled.Text`
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  margin-left: 15px;
`

const ProgressBar = styled(RNProgressBar)`
  background-color: ${props => props.theme.colors.lunesBlackUltralight};
`

const HeaderLeft = styled.TouchableOpacity`
  padding-left: 15px;
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
        headerRight: () => <HeaderText>{`${currentWord + 1} ${labels.general.header.of} ${numberOfWords}`}</HeaderText>
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

      <ConfirmationModal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        navigation={navigation}
        route={route}
      />
    </>
  )
}
export default ExerciseHeader
