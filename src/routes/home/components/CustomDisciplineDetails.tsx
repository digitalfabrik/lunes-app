import React from 'react'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import Job from '../../../models/Job'
import { getLabels, childrenLabel } from '../../../services/helpers'
import { NumberText, UnitText } from './JobCard'

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0 ${props => props.theme.spacings.xs};
`

type CustomDisciplineDetailsProps = {
  job: Job
  navigateToJob: (job: Job) => void
}

const CustomDisciplineDetails = ({ job, navigateToJob }: CustomDisciplineDetailsProps): JSX.Element => (
  <>
    <TextContainer>
      <NumberText>{job.numberUnits}</NumberText>
      <UnitText>{childrenLabel(job)}</UnitText>
    </TextContainer>
    <Button
      onPress={() => navigateToJob(job)}
      label={getLabels().home.start}
      buttonTheme={BUTTONS_THEME.outlined}
      fitToContentWidth
    />
  </>
)

export default CustomDisciplineDetails
