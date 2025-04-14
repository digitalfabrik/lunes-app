import React, { ReactElement, useContext } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { VocabularyItem } from '../constants/endpoints'
import useRepetitionService from '../hooks/useRepetitionService'
import useStorage from '../hooks/useStorage'
import { StorageCacheContext } from '../services/Storage'
import { vocabularyItemToFavorite } from '../services/helpers'
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
  const storageCache = useContext(StorageCacheContext)
  const [favorites] = useStorage('favorites')
  const isFavorite = getIsFavorite(favorites, vocabularyItemToFavorite(vocabularyItem))
  const theme = useTheme()

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(storageCache, vocabularyItemToFavorite(vocabularyItem)).catch(reportError)
    } else {
      await addFavorite(storageCache, repetitionService, vocabularyItem).catch(reportError)
    }
  }

  return (
    <Button testID={isFavorite ? 'remove' : 'add'} onPress={onPress}>
      {isFavorite ? (
        <StarCircleIconGreyFilled width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      ) : (
        <StarCircleIconGrey width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      )}
    </Button>
  )
}

export default FavoriteButton
