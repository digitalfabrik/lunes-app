import React, { useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import Title from './Title'
import VocabularyListItem from './VocabularyListItem'
import VocabularyListModal from './VocabularyListModal'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  width: 100%;
  padding: 0 ${props => props.theme.spacings.sm};
`

interface VocabularyListScreenProps {
  documents: Document[]
}

const VocabularyList = ({ documents }: VocabularyListScreenProps): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)

  const renderItem = ({ item, index }: { item: Document; index: number }): JSX.Element => (
    <VocabularyListItem
      document={item}
      setIsModalVisible={() => {
        setIsModalVisible(true)
        setSelectedDocumentIndex(index)
      }}
    />
  )

  return (
    <Root>
      {documents[selectedDocumentIndex] && (
        <VocabularyListModal
          documents={documents}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          selectedDocumentIndex={selectedDocumentIndex}
          setSelectedDocumentIndex={setSelectedDocumentIndex}
        />
      )}
      <Title
        title={labels.exercises.vocabularyList.title}
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
