import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Heading } from './text/Heading'

interface ScreenHeadingProps {
  text: string
}

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: ${props => props.theme.spacings.sm};
`

const Spacer = styled.View`
  margin-bottom: ${props => props.theme.spacings.xl};
`

const ScreenHeading = ({ text }: ScreenHeadingProps): ReactElement => (
  <>
    <StyledHeading>{text}</StyledHeading>
    <Spacer />
  </>
)

export default ScreenHeading
