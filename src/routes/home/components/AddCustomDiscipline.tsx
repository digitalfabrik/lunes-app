import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AddCircleIcon, HeaderCircleIcon } from '../../../../assets/images'
import { ContentSecondary } from '../../../components/text/Content'
import { SubheadingPrimary } from '../../../components/text/Subheading'
import labels from '../../../constants/labels.json'
import Card from './Card'

const AddCustomDisciplineContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${props => props.theme.spacings.sm} auto;
  padding: ${props => props.theme.spacings.xs};
`

const AddCustomDisciplineText = styled(SubheadingPrimary)`
  text-transform: uppercase;
  padding-left: ${props => props.theme.spacings.xs};
`

const Explanation = styled(ContentSecondary)`
  padding: ${props => props.theme.spacings.xs};
`

interface Props {
  navigate: () => void
}

const AddCustomDiscipline = ({ navigate }: Props): ReactElement => (
  <Card heading={labels.home.customDisciplineSection} icon={<HeaderCircleIcon />}>
    <>
      <Explanation>{labels.home.customDisciplineExplanation}</Explanation>
      <AddCustomDisciplineContainer onPress={navigate}>
        <AddCircleIcon width={wp('8%')} height={wp('8%')} />
        <AddCustomDisciplineText>{labels.home.addCustomDiscipline}</AddCustomDisciplineText>
      </AddCustomDisciplineContainer>
    </>
  </Card>
)

export default AddCustomDiscipline
