import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback } from 'react'

import { PenIcon } from '../../assets/images'
import PressableOpacity from '../components/PressableOpacity'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyDetail from '../components/VocabularyDetail'
import { isUserVocabularyItem, UserVocabularyItem } from '../models/VocabularyItem'
import { RoutesParams } from '../navigation/NavigationTypes'

type VocabularyDetailScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
}

type EditableVocabularyDetailScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyDetail'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetail'>
}

type EditButtonProps = {
  navigation: StackNavigationProp<RoutesParams, 'VocabularyDetail'>
  vocabularyItem: UserVocabularyItem
}

const EditButton = ({ navigation, vocabularyItem }: EditButtonProps) => (
  <PressableOpacity
    onPress={() =>
      navigation.navigate('UserVocabularyProcess', {
        itemToEdit: vocabularyItem,
      })
    }
  >
    <PenIcon />
  </PressableOpacity>
)

const VocabularyDetailScreen = ({ route }: VocabularyDetailScreenProps): ReactElement | null => {
  const { vocabularyItem } = route.params

  return (
    <RouteWrapper>
      <VocabularyDetail vocabularyItem={vocabularyItem} />
    </RouteWrapper>
  )
}

export const EditableVocabularyDetailsScreen = ({
  route,
  navigation,
}: EditableVocabularyDetailScreenProps): ReactElement | null => {
  const { vocabularyItem } = route.params

  useFocusEffect(
    useCallback(() => {
      if (isUserVocabularyItem(vocabularyItem)) {
        navigation.setOptions({
          headerRight: () => EditButton({ navigation, vocabularyItem }),
        })
      }
    }, [vocabularyItem, navigation]),
  )

  return <VocabularyDetailScreen route={route} />
}

export default VocabularyDetailScreen
