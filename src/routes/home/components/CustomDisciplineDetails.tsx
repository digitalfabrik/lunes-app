import React, { type JSX } from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { Discipline } from '../../../constants/endpoints'
import { getLabels, childrenLabel } from '../../../services/helpers'
import { NumberText, UnitText } from './DisciplineCard'

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

type CustomDisciplineDetailsProps = {
  discipline: Discipline
  navigateToDiscipline: (discipline: Discipline) => void
}

const CustomDisciplineDetails = ({ discipline, navigateToDiscipline }: CustomDisciplineDetailsProps): JSX.Element => (
  <>
    <TextContainer>
      <NumberText>{discipline.numberOfChildren}</NumberText>
      <UnitText>{childrenLabel(discipline)}</UnitText>
    </TextContainer>
    <Button
      onPress={() => navigateToDiscipline(discipline)}
      label={getLabels().home.start}
      buttonTheme={BUTTONS_THEME.outlined}
      fitToContentWidth
    />
  </>
)

export default CustomDisciplineDetails
