import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { FlatList, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

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
  font-size: ${wp('5%')}px;
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  margin-bottom: 4px;
`
const StyledList = styled(FlatList as new () => FlatList<DocumentType>)`
  width: 100%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

interface VocabularyListScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyList'>
}

const VocabularyListScreen = ({ navigation, route }: VocabularyListScreenPropsType): JSX.Element => {
  const { trainingSetId } = route.params.extraParams
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)

  const { data: documents, error, loading } = useLoadDocuments(trainingSetId)

  const Header = (
    <Title>
      <>
        <ScreenTitle>{labels.exercises.vocabularyList.title}</ScreenTitle>
        <Description>
          {documents?.length} {documents?.length === 1 ? labels.home.word : labels.home.words}
        </Description>
      </>
    </Title>
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
      {!documents || !documents[selectedDocumentIndex] ? (
        <></>
      ) : (
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
