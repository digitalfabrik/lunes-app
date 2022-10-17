import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { VocabularyItem } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { addFavorite, removeFavorite, isFavorite as getIsFavorite } from '../services/AsyncStorage'
import { reportError } from '../services/sentry'
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

interface FavoriteButtonProps {
  vocabularyItem: VocabularyItem
  onFavoritesChanged?: () => void
}

const FavoriteButton = ({ vocabularyItem, onFavoritesChanged }: FavoriteButtonProps): ReactElement | null => {
  const { data: isFavorite, refresh } = useLoadAsync(getIsFavorite, vocabularyItem.id)
  const theme = useTheme()

  useFocusEffect(refresh)

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(vocabularyItem.id).catch(reportError)
    } else {
      await addFavorite(vocabularyItem.id).catch(reportError)
    }
    refresh()
    if (onFavoritesChanged) {
      onFavoritesChanged()
    }
  }

  if (isFavorite === null) {
    return null
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
