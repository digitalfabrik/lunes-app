import React, { useState } from 'react'
import { FlatList, Text } from 'react-native'
import { DocumentType } from '../../constants/endpoints'
import Title from '../../components/Title'
import VocabularyListItem from './components/VocabularyListItem'
import Loading from '../../components/Loading'
import { COLORS } from '../../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import labels from '../../constants/labels.json'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import styled from 'styled-components/native'
import VocabularyListModal from './components/VocabularyListModal'

const Root = styled.View`
  background-color: ${COLORS.lunesWhite};
  height: 100%;
  width: 100%;
  padding-bottom: 0px;
  padding-top: 5.6%;
`
const ScreenTitle = styled.Text`
  text-align: center;
  font-size: ${wp('5%')}px;
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-SemiBold';
  margin-bottom: 4px;
`
const StyledList = styled(FlatList as new () => FlatList<DocumentType>)`
  width: 100%;
`

const Description = styled.Text`
  text-align: center;
  font-size: ${wp('4%')}px;
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
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
