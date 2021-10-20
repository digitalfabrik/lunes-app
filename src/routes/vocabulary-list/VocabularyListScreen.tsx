import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Text } from 'react-native'
import styled from 'styled-components/native'

import ListTitle from '../../components/ListTitle'
import Loading from '../../components/Loading'
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

const StyledList = styled(FlatList as new () => FlatList<DocumentType>)`
  width: 100%;
`

interface VocabularyListScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyList'>
}

const VocabularyListScreen = ({ route }: VocabularyListScreenPropsType): JSX.Element => {
  const { id } = route.params.discipline
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)

  const { data: documents, error, loading } = useLoadDocuments(id)

  const Header = (
    <ListTitle
      title={labels.exercises.vocabularyList.title}
      description={`${documents?.length ?? '0'} ${documents?.length === 1 ? labels.home.word : labels.home.words}`}
    />
  )

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
      <Loading isLoading={loading}>
        <StyledList
          data={documents}
          ListHeaderComponent={Header}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
      {error && <Text>{error.message}</Text>}
    </Root>
  )
}

export default VocabularyListScreen
