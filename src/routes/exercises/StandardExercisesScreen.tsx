import { RouteProp, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState, ReactElement } from 'react'
import { FlatList, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import FeedbackBadge from '../../components/FeedbackBadge'
import Modal from '../../components/Modal'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { Content, ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { Exercise, EXERCISE_FEEDBACK, EXERCISES, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../constants/data'
import useLoadWordsByUnit from '../../hooks/useLoadWordsByUnit'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getNumberOfUnlockedExercises, wordsDescription } from '../../services/helpers'

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
`

const BadgeWrapper = styled.View`
  height: ${props => props.theme.spacings.sm};
`

const ListItemResizer = styled.View`
  width: 100%;
  padding: 0 ${props => props.theme.spacings.lg};
`

const SmallMessage = styled(ContentTextLight)`
  margin: 0 ${props => props.theme.spacings.md} ${props => props.theme.spacings.md};
  text-align: center;
`

const UnitItem = styled(PressableOpacity)`
  background-color: ${props => props.theme.colors.backgroundBlue};
  border-radius: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.md};
  gap: ${props => props.theme.spacings.sm};
`

type ExercisesScreenProps = {
  route: RouteProp<RoutesParams, 'StandardExercises'>
  navigation: StackNavigationProp<RoutesParams, 'StandardExercises'>
}

const StandardExercisesScreen = ({ route, navigation }: ExercisesScreenProps): ReactElement => {
  const theme = useTheme()
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
      navigation.navigate(EXERCISES[item.key].screen, {
        contentType: 'standard',
        vocabularyItems,
        unitId: unit.id,
        unitTitle: unit.title,
      })
    }
  }

  const renderListItem = ({ item, index }: { item: Exercise; index: number }) => (
    <Container>
      <ListItemResizer>
        <BadgeWrapper>
          <FeedbackBadge feedback={feedback[index] ?? EXERCISE_FEEDBACK.NONE} />
        </BadgeWrapper>
        <UnitItem onPress={() => handleNavigation(item)}>
          <item.icon />
          <View>
            <Heading>{item.title}</Heading>
            <Content>{item.description}</Content>
          </View>
        </UnitItem>
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
          testID='locking-modal'
        >
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
              contentContainerStyle={{
                gap: theme.spacingsPlain.xs,
                paddingBottom: theme.spacingsPlain.sm,
              }}
            />
          </>
        )}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default StandardExercisesScreen
