import React, { useRef, ReactElement } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AddCircleIcon, PenIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import { Heading } from '../../../components/text/Heading'
import { NextExerciseData } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import { RequestParams } from '../../../hooks/useLoadDiscipline'
import useStorage from '../../../hooks/useStorage'
import { getLabels } from '../../../services/helpers'
import DisciplineCard from './DisciplineCard'

const Box = styled.View``

const BoxHeading = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} 0;
`

const BoxFooter = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
`

const IconContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.xs};
`

const Title = styled(Heading)`
  font-size: ${props => props.theme.fonts.largeFontSize};
  padding-right: ${props => props.theme.spacings.sm};
`

type SelectedProfessionsProps = {
  navigateToDiscipline: (discipline: Discipline) => void
  navigateToNextExercise: (nextExerciseData: NextExerciseData) => void
  navigateToManageSelection: () => void
  navigateToProfessionSelection: () => void
}

const useAllProfessions = (): RequestParams[] => {
  const [selectedProfessions] = useStorage('selectedProfessions')
  const [customDisciplines] = useStorage('customDisciplines')

  const localProfessionParams = selectedProfessions?.map(id => ({ disciplineId: id })) ?? []
  const customProfessionParams = customDisciplines.map(id => ({ apiKey: id }))

  return [...localProfessionParams, ...customProfessionParams]
}

const SelectedProfessions = ({
  navigateToDiscipline,
  navigateToNextExercise,
  navigateToManageSelection,
  navigateToProfessionSelection,
}: SelectedProfessionsProps): ReactElement | null => {
  const professions = useAllProfessions()
  const { disciplines } = getLabels().home
  const listRef = useRef<FlatList>(null)

  return (
    <Box>
      <BoxHeading>
        <Title>
          {disciplines} [{professions.length}]
        </Title>
        <IconContainer>
          <PressableOpacity onPress={navigateToManageSelection} testID='edit-professions-button'>
            <PenIcon />
          </PressableOpacity>
          <PressableOpacity onPress={navigateToProfessionSelection} testID='add-profession-button'>
            <AddCircleIcon />
          </PressableOpacity>
        </IconContainer>
      </BoxHeading>

      {professions.length === 1 ? (
        <DisciplineCard
          identifier={professions[0]}
          navigateToDiscipline={navigateToDiscipline}
          navigateToNextExercise={navigateToNextExercise}
        />
      ) : (
        <FlatList
          horizontal
          ref={listRef}
          // Workaround for https://github.com/facebook/react-native/issues/27504
          onEndReached={() => listRef.current?.scrollToEnd()}
          data={professions}
          keyExtractor={item => JSON.stringify(item)}
          renderItem={({ item }) => (
            <DisciplineCard
              identifier={item}
              width={wp('75%')}
              navigateToDiscipline={navigateToDiscipline}
              navigateToNextExercise={navigateToNextExercise}
            />
          )}
        />
      )}

      <BoxFooter />
    </Box>
  )
}

export default SelectedProfessions
