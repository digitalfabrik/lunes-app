import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CrystalBallIcon } from '../../../../assets/images'
import { ContentSecondary } from '../../../components/text/Content'
import theme from '../../../constants/theme'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels } from '../../../services/helpers'

const Heading = styled(ContentSecondary)`
  padding-bottom: ${props => props.theme.spacings.xs};
`

const AlternativeWords = styled(ContentSecondary)`
  margin-bottom: ${props => props.theme.spacings.md};
  font-style: italic;
`

const Root = styled.View`
  flex-direction: row;
  padding-top: ${props => props.theme.spacings.sm};
`

const Content = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

type AlternativeWordsSectionProps = {
  vocabularyItem: VocabularyItem
}

const AlternativeWordsSection = ({ vocabularyItem }: AlternativeWordsSectionProps): ReactElement | null =>
  vocabularyItem.alternatives.length > 0 ? (
    <Root>
      <CrystalBallIcon width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
      <Content>
        <Heading>{getLabels().exercises.vocabularyList.alternativeWords}</Heading>
        <AlternativeWords>
          {vocabularyItem.alternatives.map(value => `${value.article.value} ${value.word}`).join(', ')}
        </AlternativeWords>
      </Content>
    </Root>
  ) : null

export default AlternativeWordsSection
