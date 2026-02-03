import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Heading } from '../../../components/text/Heading'

const Root = styled.ScrollView`
  padding: ${props => props.theme.spacings.md} 0;
  background: ${props => props.theme.colors.background};
`

const Header = styled.View`
  padding: 0 ${props => props.theme.spacings.md};
`

const Content = styled.View`
  background: ${props => props.theme.colors.backgroundAccent};
  padding: ${props => props.theme.spacings.xs} 0;
  margin: ${props => props.theme.spacings.md} ${props => props.theme.spacings.xs};
`

const FooterContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacings.md};
`

export type TrainingExerciseContainerProps = {
  title: string
  footer?: ReactElement
  children: ReactElement[] | ReactElement
}

const TrainingExerciseContainer = ({ title, children, footer }: TrainingExerciseContainerProps): ReactElement => (
  <Root>
    <Header>
      <Heading>{title}</Heading>
    </Header>
    <Content>{children}</Content>
    <FooterContainer>{footer}</FooterContainer>
  </Root>
)

export default TrainingExerciseContainer
