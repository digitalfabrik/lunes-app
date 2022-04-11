import React, { ReactElement } from 'react'

import { FavoriteIcon } from '../../assets/images'
import { Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import useLoadAsync from '../hooks/useLoadAsync'
import AsyncStorage from '../services/AsyncStorage'
import { wordsDescription } from '../services/helpers'
import ListItem from './ListItem'
import ServerResponseHandler from './ServerResponseHandler'

interface Props {
  navigateToFavorites: (favorites: Document[]) => void
}

const FavoritesListItem = ({ navigateToFavorites }: Props): ReactElement => {
  const { data, error, loading, refresh } = useLoadAsync(AsyncStorage.getFavorites, null)

  return (
    <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
      {data && (
        <ListItem
          title={labels.favorites.favorites}
          icon={<FavoriteIcon />}
          onPress={() => navigateToFavorites(data)}
          description={wordsDescription(data.length)}
        />
      )}
    </ServerResponseHandler>
  )
}

export default FavoritesListItem
