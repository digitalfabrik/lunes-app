import React, { ReactElement } from 'react'
import { useTheme } from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import useRepetitionService from '../hooks/useRepetitionService'
import useStorage, { useStorageCache } from '../hooks/useStorage'
import VocabularyItem from '../models/VocabularyItem'
import { reportError } from '../services/sentry'
import { addFavorite, isFavorite as getIsFavorite, removeFavorite } from '../services/storageUtils'
import CircularIconButton from './CircularIconButton'

type FavoriteButtonProps = {
  vocabularyItem: VocabularyItem
}

const FavoriteButton = ({ vocabularyItem }: FavoriteButtonProps): ReactElement | null => {
  const repetitionService = useRepetitionService()
  const storageCache = useStorageCache()
  const [favorites] = useStorage('favorites')
  const isFavorite = getIsFavorite(favorites, vocabularyItem.id)
  const theme = useTheme()

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(storageCache, vocabularyItem.id).catch(reportError)
    } else {
      await addFavorite(storageCache, repetitionService, vocabularyItem).catch(reportError)
    }
  }

  return (
    <CircularIconButton testID={isFavorite ? 'remove' : 'add'} onPress={onPress} hasShadow>
      {isFavorite ? (
        <StarCircleIconGreyFilled width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      ) : (
        <StarCircleIconGrey width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      )}
    </CircularIconButton>
  )
}

export default FavoriteButton
