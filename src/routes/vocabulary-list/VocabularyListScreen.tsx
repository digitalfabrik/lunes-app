import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ServerResponseHandler from '../../components/ServerResponseHandler'
import Title from '../../components/Title'
import { DocumentType } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import VocabularyListItem from './components/VocabularyListItem'
import VocabularyListModal from './components/VocabularyListModal'

const Root = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  width: 100%;
  padding-bottom: 0;
`

const StyledList = styled(FlatList)`
  width: 100%;
` as ComponentType as new () => FlatList<DocumentType>

interface VocabularyListScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyList'>
}

const VocabularyListScreen = ({ route }: VocabularyListScreenPropsType): JSX.Element => {
  const { discipline } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)

  const { data: documents, error, loading, refresh } = useLoadDocuments(discipline)

  const renderItem = ({ item, index }: { item: DocumentType; index: number }): JSX.Element => (
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
      {documents?.[selectedDocumentIndex] && (
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
        description={`${documents?.length ?? '0'} ${
          documents?.length === 1 ? labels.general.word : labels.general.words
        }`}
      />

      <ServerResponseHandler loading={loading} error={error} refresh={refresh}>
        <StyledList
          data={documents}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </ServerResponseHandler>
    </Root>
  )
}

export default VocabularyListScreen
