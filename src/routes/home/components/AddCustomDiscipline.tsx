import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { HeaderCircleIcon } from '../../../../assets/images'
import AddElement from '../../../components/AddElement'
import { ContentSecondary } from '../../../components/text/Content'
import { getLabels } from '../../../services/helpers'
import Card from './Card'

const Explanation = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

interface AddCustomDisciplineProps {
  navigate: () => void
}

const AddCustomDiscipline = ({ navigate }: AddCustomDisciplineProps): ReactElement => (
  <Card heading={getLabels().home.customDisciplineSection} icon={<HeaderCircleIcon />}>
    <Explanation>{getLabels().home.customDisciplineExplanation}</Explanation>
    <AddElement onPress={navigate} label={getLabels().home.addCustomDiscipline} />
  </Card>
)

export default AddCustomDiscipline
