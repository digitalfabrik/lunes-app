import React from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import { getLabels, childrenLabel } from '../../../services/helpers'
import { ButtonContainer, NumberText, UnitText } from './DisciplineCard'

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

interface PropsType {
  discipline: Discipline
  navigateToDiscipline: (discipline: Discipline) => void
}

const CustomDisciplineDetails = ({ discipline, navigateToDiscipline }: PropsType): JSX.Element => (
  <>
    <TextContainer>
      <NumberText>{discipline.numberOfChildren}</NumberText>
      <UnitText>{childrenLabel(discipline)}</UnitText>
    </TextContainer>
    <ButtonContainer>
      <Button
        onPress={() => navigateToDiscipline(discipline)}
        label={getLabels().home.start}
        buttonTheme={BUTTONS_THEME.outlined}
      />
    </ButtonContainer>
  </>
)

export default CustomDisciplineDetails
