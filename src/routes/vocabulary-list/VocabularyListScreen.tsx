import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ComponentType, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import FeedbackModal from '../../components/FeedbackModal'
import Title from '../../components/Title'
import { ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { reportError } from '../../services/sentry'
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

// /* TODO Remove comment when LUN-269 is ready */
// const MenuIconPrimary = styled(MenuIcon)`
//   color: ${props => props.theme.colors.primary};
// `

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const { documents, disciplineId } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0)
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false)

  const kebabMenu = <></>
  // /* TODO Remove comment when LUN-269 is ready */
  // const kebabMenu = (
  //   <OverflowMenu icon={<MenuIconPrimary width={wp('5%')} height={wp('5%')} />}>
  //     <HiddenItem title={labels.general.header.wordFeedback} onPress={() => setIsFeedbackModalVisible(true)} />
  //   </OverflowMenu>
  // )
  useEffect(
    () =>
      navigation.setOptions({
        headerRight: () => kebabMenu
      }),
    [navigation]
  )

  useEffect(() => {
    AsyncStorage.setExerciseProgress(disciplineId, ExerciseKeys.vocabularyList, 1).catch(reportError)
  }, [])

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
      <FeedbackModal visible={isFeedbackModalVisible} onClose={() => setIsFeedbackModalVisible(false)} />
    </Root>
  )
}

export default VocabularyListScreen
