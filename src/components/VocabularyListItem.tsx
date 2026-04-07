import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import VocabularyItem from '../models/VocabularyItem'
import { getArticleColor, stringifyVocabularyItem } from '../services/helpers'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ListItem from './ListItem'
import { ContentTextLight } from './text/Content'

const StyledImage = styled.Image`
  margin-right: ${props => props.theme.spacings.sm};
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.spacings.xxl};
`
const StyledTitle = styled(ContentTextLight)<{ articleColor: string }>`
  border-radius: ${props => props.theme.spacings.xs};
  margin-bottom: ${props => props.theme.spacings.xxs};
  background-color: ${props => props.articleColor};
  align-self: flex-start;
  width: 40px;
  overflow: hidden;
  height: 20px;
  text-align: center;
`
const RightChildrenContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const FavButtonContainer = styled.View`
  padding: ${props => `0 ${props.theme.spacings.xs}`};
  align-self: center;
`

type VocabularyListItemProps = {
  vocabularyItem: VocabularyItem
  onPress: () => void
  customActions?: ReactElement
  children?: ReactElement
}

const VocabularyListItem = ({
  vocabularyItem,
  onPress,
  customActions,
  children,
}: VocabularyListItemProps): ReactElement => {
  const { article, word, images, audio } = vocabularyItem

  const title = <StyledTitle articleColor={getArticleColor(article)}>{article.value}</StyledTitle>
  const icon = images.length > 0 ? <StyledImage testID='image' source={{ uri: images[0] }} /> : undefined

  const actions = customActions ?? (
    <>
      <AudioPlayer audio={audio ?? stringifyVocabularyItem(vocabularyItem)} isTtsText={!audio} disabled={false} />
      <FavButtonContainer>
        <FavoriteButton vocabularyItem={vocabularyItem} />
      </FavButtonContainer>
    </>
  )

  return (
    <ListItem
      title={title}
      description={word}
      onPress={onPress}
      icon={icon}
      rightChildren={<RightChildrenContainer>{actions}</RightChildrenContainer>}
    >
      {children}
    </ListItem>
  )
}

export default VocabularyListItem
