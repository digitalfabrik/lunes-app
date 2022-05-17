import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { MenuIcon } from '../../../assets/images'
import FeedbackModal from '../../components/FeedbackModal'
import KebabMenu from '../../components/KebabMenu'
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

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const { documents } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)

  /* TODO Remove comment when LUNES-269 is ready */
  const kebabMenu = (
    <KebabMenu icon={<MenuIcon width={wp('5%')} height={wp('5%')} />}>
      <HiddenItem title={labels.general.header.wordFeedback} onPress={() => setIsFeedbackModalVisible(true)} />
    </KebabMenu>
  )
  useEffect(
    () =>
      navigation.setOptions({
        headerRight: () => kebabMenu
      }),
    [navigation]
  )

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
          isFeedbackModalVisible={isFeedbackModalVisible}
          documents={documents}
          isModalVisible={isModalVisible}
          kebabMenu={kebabMenu}
          setIsModalVisible={setIsModalVisible}
          selectedDocumentIndex={selectedDocumentIndex}
          setSelectedDocumentIndex={setSelectedDocumentIndex}
          setIsFeedbackModalVisible={setIsFeedbackModalVisible}
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
      <FeedbackModal visible={isFeedbackModalVisible} setVisible={setIsFeedbackModalVisible} />
    </Root>
  )
}

export default VocabularyListScreen
