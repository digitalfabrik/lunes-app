import React, { ReactElement } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import VocabularyItem from '../models/VocabularyItem'
import { wordsDescription } from '../services/helpers'
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

const VocabularyList = ({ vocabularyItems, onItemPress, title }: VocabularyListScreenProps): ReactElement => {
  const renderItem = ({ item, index }: { item: VocabularyItem; index: number }): ReactElement => (
    <VocabularyListItem vocabularyItem={item} onPress={() => onItemPress(index)} />
  )

  return (
    <Root>
      <FlatList
        ListHeaderComponent={<Title title={title} description={wordsDescription(vocabularyItems.length)} />}
        data={vocabularyItems}
        renderItem={renderItem}
        keyExtractor={item => JSON.stringify(item.id)}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default VocabularyList
