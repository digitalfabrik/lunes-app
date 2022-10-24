import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { Document } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { addFavorite, isFavorite as getIsFavorite, removeFavorite } from '../services/AsyncStorage'
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
  document: Document
  onFavoritesChanged?: () => void
}

const FavoriteButton = ({ document, onFavoritesChanged }: FavoriteButtonProps): ReactElement | null => {
  const favorite = {
    id: document.id,
    documentType: document.documentType,
    ...(document.apiKey && { apiKey: document.apiKey }),
  }

  const { data: isFavorite, refresh } = useLoadAsync(getIsFavorite, favorite)
  const theme = useTheme()
  useFocusEffect(refresh)

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(favorite).catch(reportError)
    } else {
      await addFavorite(favorite).catch(reportError)
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
