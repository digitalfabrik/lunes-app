import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import InsetAwareScrollView from '../../../components/InsetAwareScrollView'
import { Heading } from '../../../components/text/Heading'

const Root = styled.View`
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
  children: ReactNode
}

const TrainingExerciseContainer = ({ title, children, footer }: TrainingExerciseContainerProps): ReactElement => (
  <InsetAwareScrollView>
    <Root>
      <Header>
        <Heading>{title}</Heading>
      </Header>
      <Content>{children}</Content>
      <FooterContainer>{footer}</FooterContainer>
    </Root>
  </InsetAwareScrollView>
)

export default TrainingExerciseContainer
