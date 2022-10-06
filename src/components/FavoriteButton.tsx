import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { Document } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { addFavorite, removeFavorite, isFavorite as getIsFavorite } from '../services/AsyncStorage'
import { reportError } from '../services/sentry'
import PressableOpacity from './PressableOpacity'

const Icon = styled(StarCircleIconGreyFilled)`
  min-width: ${props => props.theme.spacings.lg};
  min-height: ${props => props.theme.spacings.lg};
`
const IconOutline = styled(StarCircleIconGrey)`
  min-width: ${props => props.theme.spacings.lg};
  min-height: ${props => props.theme.spacings.lg};
`
const Button = styled(PressableOpacity)`
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
  const { data: isFavorite, refresh } = useLoadAsync(getIsFavorite, document.id)

  useFocusEffect(refresh)

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(document.id).catch(reportError)
    } else {
      await addFavorite(document.id).catch(reportError)
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
      {isFavorite ? <Icon /> : <IconOutline />}
    </Button>
  )
}

export default FavoriteButton
