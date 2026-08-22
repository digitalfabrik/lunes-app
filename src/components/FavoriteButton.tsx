import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { HeartCircleIconGrey, HeartCircleIconGreyFilled } from '../../assets/images'
import useRepetitionService from '../hooks/useRepetitionService'
import useStorage, { useStorageCache } from '../hooks/useStorage'
import VocabularyItem from '../models/VocabularyItem'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { addFavorite, isFavorite as getIsFavorite, removeFavorite } from '../services/storageUtils'
import PressableOpacity from './PressableOpacity'

const Button = styled(PressableOpacity)`
  width: ${props => props.theme.spacings.lg};
  height: ${props => props.theme.spacings.lg};
  justify-content: center;
  align-items: center;
  shadow-color: ${props => props.theme.colors.shadow};
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
  border-radius: 20px;
`

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

  const { add, remove } = getLabels().favorites

  return (
    <Button testID={isFavorite ? 'remove' : 'add'} onPress={onPress} accessibilityLabel={isFavorite ? remove : add}>
      {isFavorite ? (
        <HeartCircleIconGreyFilled width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      ) : (
        <HeartCircleIconGrey width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      )}
    </Button>
  )
}

export default FavoriteButton
