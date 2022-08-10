import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { Document } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import AsyncStorage from '../services/AsyncStorage'
import { reportError } from '../services/sentry'

const Icon = styled(StarCircleIconGreyFilled)`
  min-width: ${wp('9%')}px;
  min-height: ${wp('9%')}px;
`
const IconOutline = styled(StarCircleIconGrey)`
  min-width: ${wp('9%')}px;
  min-height: ${wp('9%')}px;
`
const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`

interface Props {
  document: Document
  onFavoritesChanged?: () => void
}

const FavoriteButton = ({ document, onFavoritesChanged }: Props): ReactElement | null => {
  const { data: isFavorite, refresh } = useLoadAsync(AsyncStorage.isFavorite, document.id)

  useFocusEffect(refresh)

  const onPress = async () => {
    if (isFavorite) {
      await AsyncStorage.removeFavorite(document.id).catch(reportError)
    } else {
      await AsyncStorage.addFavorite(document.id).catch(reportError)
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
