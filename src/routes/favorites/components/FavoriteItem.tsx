import React, { ReactElement } from 'react'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { Favorite } from '../../../constants/data'
import useLoadFavorite from '../../../hooks/useLoadFavorite'
import VocabularyItem from '../../../models/VocabularyItem'

type FavoriteItemProps = {
  favorite: Favorite
  onPress: (vocabularyItem: VocabularyItem) => void
}

const FavoriteItem = ({ favorite, onPress }: FavoriteItemProps): ReactElement | null => {
  const { data } = useLoadFavorite(favorite)

  return data && <VocabularyListItem vocabularyItem={data} onPress={() => onPress(data)} />
}

export default FavoriteItem
