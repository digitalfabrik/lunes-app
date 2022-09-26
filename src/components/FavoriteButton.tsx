import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { VocabularyItem } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import AsyncStorage from '../services/AsyncStorage'
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
  vocabularyItem: VocabularyItem
  onFavoritesChanged?: () => void
}

const FavoriteButton = ({ vocabularyItem, onFavoritesChanged }: Props): ReactElement | null => {
  const { data: isFavorite, refresh } = useLoadAsync(AsyncStorage.isFavorite, vocabularyItem.id)

  useFocusEffect(refresh)

  const onPress = async () => {
    if (isFavorite) {
      await AsyncStorage.removeFavorite(vocabularyItem.id).catch(reportError)
    } else {
      await AsyncStorage.addFavorite(vocabularyItem.id).catch(reportError)
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
