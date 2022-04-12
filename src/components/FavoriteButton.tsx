import React, { ReactElement, useEffect, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { FavoriteIcon, FavoriteIconOutline } from '../../assets/images'
import { Document } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'

const Container = styled.View`
  padding: ${props => `${props.theme.spacings.xs} 0  ${props.theme.spacings.xs} ${props.theme.spacings.sm}`};
  align-self: center;
`

const Icon = styled(FavoriteIcon)`
  min-width: ${wp('9%')}px;
  min-height: ${wp('9%')}px;
`
const IconOutline = styled(FavoriteIconOutline)`
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
}

const FavoriteButton = ({ document }: Props): ReactElement | null => {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)

  useEffect(() => {
    AsyncStorage.isFavorite(document)
      .then(it => setIsFavorite(it))
      .catch(() => undefined)
  }, [document])

  const setFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false)
      AsyncStorage.removeFavorite(document).catch(() => setIsFavorite(true))
    } else {
      setIsFavorite(true)
      AsyncStorage.addFavorite(document).catch(() => setIsFavorite(false))
    }
  }

  if (isFavorite === null) {
    return null
  }

  return (
    <Container>
      <Button onPress={setFavorite}>{isFavorite ? <Icon /> : <IconOutline />}</Button>
    </Container>
  )
}

export default FavoriteButton
