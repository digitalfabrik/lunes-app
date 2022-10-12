import { CommonActions } from '@react-navigation/native'
import React, { ReactElement } from 'react'

import VocabularyListItem from '../../../components/VocabularyListItem'
import { Favorite } from '../../../constants/data'
import useLoadWord from '../../../hooks/useLoadFavorite'
import useLoadFavorite from '../../../hooks/useLoadFavorite'
import { getLabels } from '../../../services/helpers'

interface FavoriteItemProps {
  favorite: Favorite
  onPress: () => void
  onFavoritesChange: () => void
}

const FavoriteItem = ({ favorite, onPress, onFavoritesChange }: FavoriteItemProps): ReactElement => {
  const { data } = useLoadFavorite(favorite)

  return data ? (
    <VocabularyListItem document={data} onPress={() => onItemPress(index)} onFavoritesChanged={refresh} />
  ) : (
    <></>
  )
}

export default FavoriteItem
