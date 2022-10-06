import React, { ReactElement } from 'react'
import { Subheading } from 'react-native-paper'
import styled from 'styled-components/native'

import { SadSmileyIcon } from '../../assets/images'

const ListEmptyContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const StyledSadSmileyIcon = styled(SadSmileyIcon)`
  padding: ${props => props.theme.spacings.md} 0;
`

interface ListEmptyProps {
  label: string
}

const ListEmpty = ({ label }: ListEmptyProps): ReactElement => (
  <ListEmptyContainer>
    <StyledSadSmileyIcon />
    <Subheading>{label}</Subheading>
  </ListEmptyContainer>
)

export default ListEmpty
