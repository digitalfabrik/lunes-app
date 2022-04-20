import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { AddCircleIcon } from '../../assets/images'
import { ContentSecondary } from './text/Content'
import { SubheadingPrimary } from './text/Subheading'

const Root = styled.TouchableOpacity`
  margin: ${props => props.theme.spacings.sm} 0;
`

const AddCustomDisciplineText = styled(SubheadingPrimary)`
  text-transform: uppercase;
  padding-left: ${props => props.theme.spacings.xs};
`

const Explanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.xxl} 0 11%;
`

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

interface Props {
  onPress: () => void
  label: string
  explanation?: string
}

const AddElement = ({ onPress, label, explanation }: Props): ReactElement => (
  <Root onPress={onPress}>
    <FlexRow>
      <AddCircleIcon width={wp('8%')} height={wp('8%')} />
      <AddCustomDisciplineText>{label}</AddCustomDisciplineText>
    </FlexRow>
    {explanation && <Explanation>{explanation}</Explanation>}
  </Root>
)

export default AddElement
