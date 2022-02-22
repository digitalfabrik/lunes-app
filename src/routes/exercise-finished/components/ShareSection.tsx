import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Discipline } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DocumentResult } from '../../../navigation/NavigationTypes'
import ShareButton from './ShareButton'

const Container = styled.View`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.sm};
  border-radius: 6px;
  shadow-color: ${props => props.theme.colors.shadow};
  elevation: 10;
  background-color: ${props => props.theme.colors.backgroundAccent};
`

const Description = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.largeFontSize};
  text-align: center;
  padding-bottom: ${props => props.theme.spacings.sm};
`

interface Props {
  discipline: Discipline
  results: DocumentResult[]
}

const ShareSection = ({ discipline, results }: Props): ReactElement => (
  <Container>
    <Description>{labels.results.share.description}</Description>
    <ShareButton discipline={discipline} results={results} />
  </Container>
)

export default ShareSection
