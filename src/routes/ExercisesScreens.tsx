import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Alert } from 'react-native'
import styled from 'styled-components/native'

import ConfirmationModal from '../components/ConfirmationModal'
import ListItem from '../components/ListItem'
import Title from '../components/Title'
import Trophy from '../components/Trophy'
import { ContentTextBold, ContentTextLight } from '../components/text/Content'
import { EXERCISES, Exercise } from '../constants/data'
import labels from '../constants/labels.json'
import { RoutesParams } from '../navigation/NavigationTypes'
import { childrenDescription } from '../services/helpers'
import { MIN_WORDS } from './choice-exercises/WordChoiceExerciseScreen'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`
const SmallMessage = styled(ContentTextLight)`
  margin: 0 ${props => props.theme.spacings.md} ${props => props.theme.spacings.md};
  text-align: center;
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
  const currentLevel = 2 //  TODO: LUN-131 logic
  const handleNavigation = (item: Exercise): void => {
    if (item.level < currentLevel) {
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
        text={labels.exercises.lockedExerciseModal.title}
        confirmationButtonText={labels.exercises.lockedExerciseModal.confirmBotton}
        cancelButtonText={labels.exercises.lockedExerciseModal.cancelBotton}
        lockingModal
        confirmationAction={() => {
          navigation.navigate(EXERCISES[currentLevel].nextScreen, {
            discipline
          })
          setIsModalVisible(false)
        }}>
        <SmallMessage>
          {labels.exercises.lockedExerciseModal.descriptionPart1}
          <ContentTextBold> Level {currentLevel-1}</ContentTextBold>{' '}
          {labels.exercises.lockedExerciseModal.descriptionPart2}
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
