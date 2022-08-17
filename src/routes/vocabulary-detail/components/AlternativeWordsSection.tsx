import React, { useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowRightIcon, CrystalBallIcon } from '../../../../assets/images'
import FeedbackModal from '../../../components/FeedbackModal'
import { ContentSecondary, ContentTextBold } from '../../../components/text/Content'
import { FeedbackType } from '../../../constants/data'
import { Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import theme from '../../../constants/theme'

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

const SuggestionPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.xs} 0 ${props => props.theme.spacings.xxl};
`

const Label = styled(ContentTextBold)`
  text-transform: uppercase;
`

interface Props {
  document: Document
}

const AlternativeWordsSection = ({ document }: Props): JSX.Element => {
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)
  return (
    <Root>
      <CrystalBallIcon width={wp('8%')} height={wp('8%')} />
      <Content>
        {document.alternatives.length > 0 && (
          <>
            <Heading>{labels.exercises.vocabularyList.alternativeWords}</Heading>
            <AlternativeWords>
              {document.alternatives.map(value => `${value.article.value} ${value.word}`).join(', ')}
            </AlternativeWords>
          </>
        )}

        <SuggestionPressable onPress={() => setIsFeedbackModalVisible(true)}>
          <Label>{labels.exercises.vocabularyList.suggestAlternative}</Label>
          <ArrowRightIcon fill={theme.colors.black} width={wp('6%')} height={wp('6%')} />
        </SuggestionPressable>
      </Content>
      <FeedbackModal
        visible={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
        feedbackType={FeedbackType.document}
        feedbackForId={document.id}
      />
    </Root>
  )
}

export default AlternativeWordsSection
