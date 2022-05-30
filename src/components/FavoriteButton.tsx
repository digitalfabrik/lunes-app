import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { StarCircleIconGrey, StarCircleIconGreyFilled } from '../../assets/images'
import { Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import AsyncStorage from '../services/AsyncStorage'

const Container = styled.View`
  padding: ${props => `${props.theme.spacings.xs} 0  ${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  align-self: center;
`

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
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

interface Props {
  document: Document
  refreshFavorites?: () => void
}

const FavoriteButton = ({ document, refreshFavorites }: Props): ReactElement | null => {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)

  const loadIsFavorite = useCallback(() => {
    AsyncStorage.isFavorite(document)
      .then(it => setIsFavorite(it))
      .catch(() => undefined)
  }, [document])

  useFocusEffect(loadIsFavorite)

  const onPress = async () => {
    if (isFavorite) {
      setIsFavorite(false)
      await AsyncStorage.removeFavorite(document).catch(() => setIsFavorite(true))
    } else {
      setIsFavorite(true)
      await AsyncStorage.addFavorite(document).catch(() => setIsFavorite(false))
    }
    if (refreshFavorites) {
      refreshFavorites()
    }
  }

  if (isFavorite === null) {
    return null
  }

  return (
    <Container>
      <Button accessibilityLabel={isFavorite ? labels.favorites.remove : labels.favorites.add} onPress={onPress}>
        {isFavorite ? <Icon /> : <IconOutline />}
      </Button>
    </Container>
  )
}

export default FavoriteButton
