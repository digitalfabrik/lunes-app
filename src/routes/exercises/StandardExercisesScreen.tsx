import { RouteProp, StackActions, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState, ReactElement } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListItem from '../../components/ListItem'
import Modal from '../../components/Modal'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Exercise, EXERCISE_FEEDBACK, EXERCISES, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../constants/data'
import useLoadWordsByUnit from '../../hooks/useLoadWordsByUnit'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getNumberOfUnlockedExercises, wordsDescription } from '../../services/helpers'
import LockingLane from './components/LockingLane'

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ListItemResizer = styled.View`
  width: ${wp('85%')}px;
`

const SmallMessage = styled(ContentTextLight)`
  margin: 0 ${props => props.theme.spacings.md} ${props => props.theme.spacings.md};
  text-align: center;
`

type ExercisesScreenProps = {
  route: RouteProp<RoutesParams, 'StandardExercises'>
  navigation: StackNavigationProp<RoutesParams, 'StandardExercises'>
}

const StandardExercisesScreen = ({ route, navigation }: ExercisesScreenProps): ReactElement => {
  const { unit } = route.params
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [scores] = useStorage('progress')
  const nextExerciseNumber = getNumberOfUnlockedExercises(scores, unit.id)
  const nextExercise = nextExerciseNumber < EXERCISES.length ? EXERCISES[nextExerciseNumber] : null
  const [feedback, setFeedback] = useState<EXERCISE_FEEDBACK[]>([])
  const [isFeedbackSet, setIsFeedbackSet] = useState<boolean>(false)
  const isFocused = useIsFocused()
  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByUnit(unit.id)

  useEffect(() => {
    if (!isFeedbackSet) {
      const exerciseScores = scores[unit.id.id] ?? {}
      const updatedFeedback: EXERCISE_FEEDBACK[] = Object.values(exerciseScores).map(score => {
        if (!score) {
          return EXERCISE_FEEDBACK.NONE
        }
        return score > SCORE_THRESHOLD_POSITIVE_FEEDBACK ? EXERCISE_FEEDBACK.POSITIVE : EXERCISE_FEEDBACK.NEGATIVE
      })
      updatedFeedback[0] = EXERCISE_FEEDBACK.NONE
      setFeedback(updatedFeedback)
      setIsFeedbackSet(true)
    }
  }, [isFeedbackSet, unit, scores])

  useEffect(() => {
    if (isFocused) {
      setIsFeedbackSet(false)
    }
  }, [isFocused])

  const handleNavigation = (item: Exercise): void => {
    if (nextExercise && item.level > nextExercise.level) {
      setIsModalVisible(true)
      return
    }
    if (vocabularyItems) {
      const closeExerciseAction = StackActions.popTo('BottomTabNavigator')
      navigation.navigate(EXERCISES[item.key].screen, {
        contentType: 'standard',
        vocabularyItems,
        unitId: unit.id,
        unitTitle: unit.title,
        closeExerciseAction,
      })
    }
  }

  const renderListItem = ({ item, index }: { item: Exercise; index: number }): ReactElement | null => (
    <Container>
      <LockingLane nextExercise={nextExercise} index={index} />
      <ListItemResizer>
        <ListItem
          title={item.title}
          description={item.description}
          onPress={() => handleNavigation(item)}
          arrowDisabled={nextExercise === null || item.level > nextExercise.level}
          feedback={feedback[item.level] ?? EXERCISE_FEEDBACK.NONE}
        />
      </ListItemResizer>
    </Container>
  )

  const nextExercisePreposition =
    nextExercise?.key === 0
      ? getLabels().exercises.lockedExerciseModal.confirmButtonLabelDeclinated
      : getLabels().exercises.lockedExerciseModal.confirmButtonLabel
  return (
    <RouteWrapper>
      {vocabularyItems && nextExercise && (
        <Modal
          onClose={() => setIsModalVisible(false)}
          visible={isModalVisible}
          text={getLabels().exercises.lockedExerciseModal.title}
          confirmationButtonText={`${nextExercisePreposition} ${nextExercise.title}`}
          confirmationAction={() => {
            handleNavigation(nextExercise)
            setIsModalVisible(false)
          }}
          testID='locking-modal'>
          <SmallMessage>
            {getLabels().exercises.lockedExerciseModal.descriptionPart1}
            <ContentTextBold>{` ${nextExercise.title} `}</ContentTextBold>
            {getLabels().exercises.lockedExerciseModal.descriptionPart2}
          </SmallMessage>
        </Modal>
      )}
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {vocabularyItems && (
          <>
            <Title title={unit.title} description={wordsDescription(vocabularyItems.length)} />
            <FlatList
              data={EXERCISES}
              renderItem={renderListItem}
              keyExtractor={({ key }) => key.toString()}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default StandardExercisesScreen
