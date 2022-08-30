import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ListItem from '../../components/ListItem'
import Modal from '../../components/Modal'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import Trophy from '../../components/Trophy'
import { ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Exercise, EXERCISES } from '../../constants/data'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getDoneExercises, wordsDescription } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import LockingLane from './components/LockingLane'

const Container = styled.View`
  display: flex;
  flex-direction: row;
`

const ListItemResizer = styled.View`
  width: ${wp('85%')}px;
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
  const { discipline, disciplineTitle, disciplineId } = route.params
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [nextExercise, setNextExercise] = useState<Exercise | null>(EXERCISES[0])

  const {
    data: documents,
    error,
    loading,
    refresh,
  } = useLoadDocuments({
    disciplineId: discipline.id,
    apiKey: discipline.apiKey,
  })

  useFocusEffect(
    useCallback(() => {
      getDoneExercises(disciplineId)
        .then(value => setNextExercise(value < EXERCISES.length ? EXERCISES[value] : null))
        .catch(reportError)
    }, [disciplineId])
  )

  const handleNavigation = (item: Exercise): void => {
    if (nextExercise && item.level > nextExercise.level) {
      setIsModalVisible(true)
      return
    }
    if (documents) {
      const closeExerciseAction = CommonActions.navigate('Exercises', {
        documents,
        disciplineTitle,
        disciplineId,
        discipline,
      })
      navigation.navigate(EXERCISES[item.key].screen, {
        documents,
        disciplineId,
        disciplineTitle,
        closeExerciseAction,
      })
    }
  }

  const renderListItem = ({ item, index }: { item: Exercise; index: number }): JSX.Element | null => (
    <Container>
      <LockingLane nextExercise={nextExercise} index={index} />
      <ListItemResizer>
        <ListItem
          title={item.title}
          description={item.description}
          onPress={() => handleNavigation(item)}
          arrowDisabled={nextExercise === null || item.level > nextExercise.level}>
          <Trophy level={item.level} />
        </ListItem>
      </ListItemResizer>
    </Container>
  )

  const nextExercisePreposition =
    nextExercise?.key === 0
      ? getLabels().exercises.lockedExerciseModal.confirmButtonLabelDeclinated
      : getLabels().exercises.lockedExerciseModal.confirmButtonLabel
  return (
    <RouteWrapper>
      {documents && nextExercise && (
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
        {documents && (
          <>
            <Title title={disciplineTitle} description={wordsDescription(documents.length)} />
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

export default ExercisesScreen
