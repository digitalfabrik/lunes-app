import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import { getLabels } from '../services/helpers'
import Title from './Title'
import VocabularyListItem from './VocabularyListItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

interface VocabularyListScreenProps {
  documents: Document[]
  onItemPress: (index: number) => void
  onFavoritesChanged?: () => void
  title: string
}

const VocabularyList = ({
  documents,
  onItemPress,
  onFavoritesChanged,
  title,
}: VocabularyListScreenProps): JSX.Element => {
  const renderItem = ({ item, index }: { item: Document; index: number }): JSX.Element => (
    <VocabularyListItem document={item} onPress={() => onItemPress(index)} onFavoritesChanged={onFavoritesChanged} />
  )

  return (
    <Root>
      <FlatList
        ListHeaderComponent={
          <Title
            title={title}
            description={`${documents.length} ${
              documents.length === 1 ? getLabels().general.word : getLabels().general.words
            }`}
          />
        }
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default VocabularyList
