import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { SadSmileyIcon } from '../../assets/images'
import { Subheading } from './text/Subheading'

const ListEmptyContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const StyledSadSmileyIcon = styled(SadSmileyIcon)`
  padding: ${props => props.theme.spacings.md} 0;
  color: ${props => props.theme.colors.text};
`

type ListEmptyProps = {
  label: string
}

const ListEmpty = ({ label }: ListEmptyProps): ReactElement => (
  <ListEmptyContainer>
    <StyledSadSmileyIcon />
    <Subheading>{label}</Subheading>
  </ListEmptyContainer>
)

export default ListEmpty
