import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
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
  padding-top: 5.6%;
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.largeFontSize};
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  margin-bottom: 4px;
`
const StyledList = styled(FlatList as new () => FlatList<DocumentType>)`
  width: 100%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

interface VocabularyListScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyList'>
}

const VocabularyListScreen = ({ route }: VocabularyListScreenPropsType): JSX.Element => {
  const { id } = route.params.discipline
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)

  const { data: documents, error, loading, refresh } = useLoadDocuments(id)

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
      <Title>
        <>
          <ScreenTitle>{labels.exercises.vocabularyList.title}</ScreenTitle>
          <Description>
            {documents?.length} {documents?.length === 1 ? labels.home.word : labels.home.words}
          </Description>
        </>
      </Title>

      <Loading isLoading={loading}>
        <>
          <ErrorMessage error={error} refresh={refresh} />
          <StyledList
            data={documents}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        </>
      </Loading>
    </Root>
  )
}

export default VocabularyListScreen
