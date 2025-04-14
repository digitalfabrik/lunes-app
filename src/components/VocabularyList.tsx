import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { VocabularyItem } from '../constants/endpoints'
import { getLabels } from '../services/helpers'
import Title from './Title'
import VocabularyListItem from './VocabularyListItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

type VocabularyListScreenProps = {
  vocabularyItems: VocabularyItem[]
  onItemPress: (index: number) => void
  title: string
}

const VocabularyList = ({ vocabularyItems, onItemPress, title }: VocabularyListScreenProps): JSX.Element => {
  const renderItem = ({ item, index }: { item: VocabularyItem; index: number }): JSX.Element => (
    <VocabularyListItem vocabularyItem={item} onPress={() => onItemPress(index)} />
  )

  return (
    <Root>
      <FlatList
        ListHeaderComponent={
          <Title
            title={title}
            description={`${vocabularyItems.length} ${
              vocabularyItems.length === 1 ? getLabels().general.word : getLabels().general.words
            }`}
          />
        }
        data={vocabularyItems}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default VocabularyList
