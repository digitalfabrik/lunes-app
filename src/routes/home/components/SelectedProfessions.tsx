import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { AddCircleIcon, PenIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import { Heading } from '../../../components/text/Heading'
import { NextExerciseData } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import { RequestParams } from '../../../hooks/useLoadDiscipline'
import useStorage from '../../../hooks/useStorage'
import DisciplineCard from './DisciplineCard'

const Box = styled.View`
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
`

const BoxHeading = styled.View`
  margin: ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} 0;
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
}: SelectedProfessionsProps): JSX.Element | null => {
  const professions = useAllProfessions()

  if (professions.length === 0) {
    return null
  }

  return (
    <Box>
      <BoxHeading>
        <Title>Berufe [{professions.length}]</Title>
        <IconContainer>
          <PressableOpacity onPress={navigateToManageSelection}>
            <PenIcon />
          </PressableOpacity>
          <PressableOpacity onPress={navigateToProfessionSelection}>
            <AddCircleIcon />
          </PressableOpacity>
        </IconContainer>
      </BoxHeading>

      <FlatList
        horizontal
        data={professions}
        keyExtractor={item => JSON.stringify(item)}
        renderItem={({ item }) => (
          <DisciplineCard
            identifier={item}
            navigateToDiscipline={navigateToDiscipline}
            navigateToNextExercise={navigateToNextExercise}
          />
        )}
      />
    </Box>
  )
}

export default SelectedProfessions
