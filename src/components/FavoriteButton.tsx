import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { DOCUMENT_TYPES } from '../constants/data'
import { Document } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { addFavorite, removeFavorite, isFavorite as getIsFavorite } from '../services/AsyncStorage'
import { reportError } from '../services/sentry'
import PressableOpacity from './PressableOpacity'

const Icon = styled(StarCircleIconGreyFilled)`
  min-width: ${wp('9%')}px;
  min-height: ${wp('9%')}px;
`
const IconOutline = styled(StarCircleIconGrey)`
  min-width: ${wp('9%')}px;
  min-height: ${wp('9%')}px;
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

interface Props {
  document: Document
  onFavoritesChanged?: () => void
}

const FavoriteButton = ({ document, onFavoritesChanged }: Props): ReactElement | null => {
  const favorite = {
    id: document.id,
    documentType: document.documentType,
    ...(document.apiKey && { apiKey: document.apiKey }),
  }
  const { data: isFavorite, refresh } = useLoadAsync(getIsFavorite, favorite)

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
      {isFavorite ? <Icon /> : <IconOutline />}
    </Button>
  )
}

export default FavoriteButton
