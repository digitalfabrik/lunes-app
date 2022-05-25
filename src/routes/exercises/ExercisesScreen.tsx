import { CommonActions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import ConfirmationModal from '../../components/ConfirmationModal'
import ListItem from '../../components/ListItem'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import Trophy from '../../components/Trophy'
import { ContentTextBold, ContentTextLight } from '../../components/text/Content'
import { Exercise, EXERCISES } from '../../constants/data'
import labels from '../../constants/labels.json'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { wordsDescription } from '../../services/helpers'
import LockingLane from './components/LockingLane'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
`

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

  const {
    data: documents,
    error,
    loading,
    refresh
  } = useLoadDocuments({
    disciplineId: discipline.id,
    apiKey: discipline.apiKey
  })

  const currentExercise: Exercise = EXERCISES[3] //  TODO: LUN-131 logic , note: currentExercise is the last level that can be accessed.

  const handleNavigation = (item: Exercise): void => {
    if (item.level > currentExercise.level) {
      setIsModalVisible(true)
      return
    }
    if (documents) {
      const closeExerciseAction = CommonActions.navigate('Exercises', {
        documents,
        disciplineTitle,
        disciplineId,
        discipline
      })
      navigation.navigate(EXERCISES[item.key].screen, {
        documents,
        disciplineId,
        disciplineTitle,
        closeExerciseAction
      })
    }
  }

  const Item = ({ item, index }: { item: Exercise; index: number }): JSX.Element | null => (
    <Container>
      <LockingLane current={currentExercise} index={index} />
      <ListItemResizer>
        <ListItem
          title={item.title}
          description={item.description}
          onPress={() => handleNavigation(item)}
          arrowDisabled={item.level > currentExercise.level}>
          <Trophy level={item.level} />
        </ListItem>
      </ListItemResizer>
    </Container>
  )

  return (
    <Root>
      {documents && (
        <ConfirmationModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          text={labels.exercises.lockedExerciseModal.title}
          confirmationButtonText={labels.exercises.lockedExerciseModal.confirmBotton}
          cancelButtonText={labels.exercises.lockedExerciseModal.cancelBotton}
          lockingModal
          confirmationAction={() => {
            handleNavigation(currentExercise)
            setIsModalVisible(false)
          }}>
          <SmallMessage>
            {labels.exercises.lockedExerciseModal.descriptionPart1}
            <ContentTextBold>
              {' '}
              {
                // eslint-disable-next-line
                EXERCISES[currentExercise.level] !== undefined ? currentExercise.title : EXERCISES[0].title
              }{' '}
            </ContentTextBold>
            {labels.exercises.lockedExerciseModal.descriptionPart2}
          </SmallMessage>
        </ConfirmationModal>
      )}
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && (
          <>
            <Title title={disciplineTitle} description={wordsDescription(documents.length)} />

            <FlatList
              data={EXERCISES}
              renderItem={Item}
              keyExtractor={({ key }) => key.toString()}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </ServerResponseHandler>
    </Root>
  )
}

export default ExercisesScreen
