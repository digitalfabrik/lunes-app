import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import { getArticleColor, stringifyVocabularyItem } from '../services/helpers'
import AudioPlayer from './AudioPlayer'
import FavoriteButton from './FavoriteButton'
import ListItem from './ListItem'
import { ContentTextLight } from './text/Content'

const StyledImage = styled.Image`
  margin-right: ${props => props.theme.spacings.sm};
  width: ${hp('7.5%')}px;
  height: ${hp('7.5%')}px;
  border-radius: ${props => props.theme.spacings.xxl};
`
const StyledTitle = styled(ContentTextLight)<{ articleColor: string }>`
  border-radius: ${props => props.theme.spacings.xs};
  margin-bottom: ${props => props.theme.spacings.xxs};
  background-color: ${props => props.articleColor};
  align-self: flex-start;
  width: ${hp('5%')}px;
  overflow: hidden;
  height: ${hp('2.5%')}px;
  text-align: center;
`
const RightChildrenContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const FavButtonContainer = styled.View`
  padding: ${props => `0 ${props.theme.spacings.xs} 0 ${props.theme.spacings.sm}`};
  align-self: center;
`

interface VocabularyListItemProps {
  vocabularyItem: VocabularyItem
  onPress: () => void
  onFavoritesChanged?: () => void
  children?: ReactElement
}

const VocabularyListItem = ({
  vocabularyItem,
  onPress,
  onFavoritesChanged,
  children,
}: VocabularyListItemProps): ReactElement => {
  const { article, word, images, audio } = vocabularyItem
  const theme = useTheme()

  const title = <StyledTitle articleColor={getArticleColor(article)}>{article.value}</StyledTitle>
  const icon =
    images.length > 0 ? (
      <StyledImage
        testID='image'
        source={{ uri: images[0].image }}
        width={theme.spacingsPlain.md}
        height={theme.spacingsPlain.md}
      />
    ) : undefined

  return (
    <ListItem
      title={title}
      description={word}
      onPress={onPress}
      icon={icon}
      rightChildren={
        <RightChildrenContainer>
          <AudioPlayer audio={audio ?? stringifyVocabularyItem(vocabularyItem)} isTtsText={!audio} disabled={false} />
          <FavButtonContainer>
            <FavoriteButton vocabularyItem={vocabularyItem} onFavoritesChanged={onFavoritesChanged} />
          </FavButtonContainer>
        </RightChildrenContainer>
      }>
      {children}
    </ListItem>
  )
}

export default VocabularyListItem
