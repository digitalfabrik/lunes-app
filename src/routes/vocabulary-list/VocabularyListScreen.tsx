import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import Title from '../../components/Title'
import { Document } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import VocabularyListItem from './components/VocabularyListItem'
import VocabularyListModal from './components/VocabularyListModal'

const Root = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  width: 100%;
  padding: 0 ${props => props.theme.spacings.sm};
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<Document>

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route }: VocabularyListScreenProps): JSX.Element => {
  const { documents } = route.params
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

      <StyledList
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </Root>
  )
}

export default VocabularyListScreen
