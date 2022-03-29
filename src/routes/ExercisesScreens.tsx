import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Alert } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ConfirmationModal from '../components/ConfirmationModal'
import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { HeadingText } from '../components/text/Heading'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`
const SmallMessage = styled(HeadingText)`
  width: ${wp('60%')}px;
  margin-bottom: ${props => props.theme.spacings.md};
  text-align: center;
  font-size: ${prop => prop.theme.fonts.defaultFontSize};
  font-weight: ${prop => prop.theme.fonts.lightFontWeight};
`
const BoldText = styled(HeadingText)`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${prop => prop.theme.fonts.defaultFontSize};
`

interface ExercisesScreenProps {
  route: RouteProp<RoutesParams, 'Exercises'>
  navigation: StackNavigationProp<RoutesParams, 'Exercises'>
}

const ExercisesScreen = ({ route, navigation }: ExercisesScreenProps): JSX.Element => {
  const { discipline } = route.params
  const { title } = discipline
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const Header = <Title title={title} description={childrenDescription(discipline)} />

  const handleNavigation = (item: Exercise): void => {
    const CurrentLevel = 4 //  here is a hard coded level for locking exercice modal
    if (item.level <= CurrentLevel) {
      if (item.title === labels.exercises.wordChoice.title && discipline.numberOfChildren < MIN_WORDS) {
        Alert.alert(labels.exercises.wordChoice.errorWrongModuleSize)
      } else {
        navigation.navigate(EXERCISES[item.key].nextScreen, {
          discipline
        })
      }
    } else {
      setIsModalVisible(true)
    }
  }

  const Item = ({ item }: { item: Exercise }): JSX.Element | null => (
    <ListItem title={item.title} description={item.description} onPress={() => handleNavigation(item)}>
      <Trophy level={item.level} />
    </ListItem>
  )

  return (
    <Root>
      <ConfirmationModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        text="Ups, this exercise is still unlocked."
        confirmationButtonText="OK,GOT IT!"
        cancelButtonText="UNLOCK EXERSCISE"
        confirmationAction={() => null}>
        <SmallMessage>
          you have to complete <BoldText>prerequisite</BoldText> to unlock the next exercise.
        </SmallMessage>
      </ConfirmationModal>
      <FlatList
        data={EXERCISES}
        ListHeaderComponent={Header}
        renderItem={Item}
        keyExtractor={({ key }) => key.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default ExercisesScreen
