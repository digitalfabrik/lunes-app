import React, { ReactElement } from 'react'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { Favorite } from '../../../constants/data'
import { Document } from '../../../constants/endpoints'
import useLoadFavorite from '../../../hooks/useLoadFavorite'
import { removeFavorite } from '../../../services/AsyncStorage'

interface FavoriteItemProps {
  favorite: Favorite
  refresh: () => void
  onPress: (document: Document) => void
}

const FavoriteItem = ({ favorite, refresh, onPress }: FavoriteItemProps): ReactElement | null => {
  const { data } = useLoadFavorite(favorite)

  const onFavoriteChange = async () => {
    await removeFavorite(favorite)
    refresh()
  }

  return (
    data && (
      <VocabularyListItem
        key={`${favorite.id}-${favorite.documentType}`}
        document={data}
        onPress={() => onPress(data)}
        onFavoritesChanged={onFavoriteChange}
      />
    )
  )
}

export default FavoriteItem
