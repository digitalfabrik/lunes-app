import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { HeaderCircleIcon } from '../../../../assets/images'
import AddElement from '../../../components/AddElement'
import { ContentSecondary } from '../../../components/text/Content'
import labels from '../../../constants/labels.json'
import Card from './Card'

const Explanation = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

interface Props {
  navigate: () => void
}

const AddCustomDiscipline = ({ navigate }: Props): ReactElement => (
  <Card heading={labels.home.customDisciplineSection} icon={<HeaderCircleIcon />}>
    <Explanation>{labels.home.customDisciplineExplanation}</Explanation>
    <AddElement onPress={navigate} label={labels.home.addCustomDiscipline} />
  </Card>
)

export default AddCustomDiscipline
