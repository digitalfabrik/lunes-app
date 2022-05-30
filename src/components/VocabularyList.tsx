import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import Title from './Title'
import VocabularyListItem from './VocabularyListItem'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  width: 100%;
  padding: 0 ${props => props.theme.spacings.sm};
`

interface VocabularyListScreenProps {
  documents: Document[]
  onItemPress: (index: number) => void
  refreshFavorites?: () => void
  title: string
}

const VocabularyList = ({
  documents,
  onItemPress,
  refreshFavorites,
  title
}: VocabularyListScreenProps): JSX.Element => {
  const renderItem = ({ item, index }: { item: Document; index: number }): JSX.Element => (
    <VocabularyListItem document={item} onPress={() => onItemPress(index)} refreshFavorites={refreshFavorites} />
  )

  return (
    <Root>
      <Title
        title={title}
        description={`${documents.length} ${documents.length === 1 ? labels.general.word : labels.general.words}`}
      />

      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default VocabularyList
