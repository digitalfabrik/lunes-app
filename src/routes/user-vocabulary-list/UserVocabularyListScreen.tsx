import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { AddIconWhite } from '../../../assets/images'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import Title from '../../components/Title'
import { ContentTextBold } from '../../components/text/Content'
import { BUTTONS_THEME } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import useKeyboard from '../../hooks/useKeyboard'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { deleteUserVocabularyItem } from '../../services/AsyncStorage'
import { getLabels, getSortedAndFilteredVocabularyItems } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import ListEmptyContent from './components/ListEmptyContent'
import ListItem from './components/ListItem'

const Root = styled.View`
  padding: 0 ${props => props.theme.spacings.sm};
`

const EditPressable = styled.Pressable`
  align-self: flex-end;
  padding: ${props => props.theme.spacings.sm} 0;
`

const ButtonContainer = styled.View`
  padding-bottom: ${props => props.theme.spacings.sm};
  position: absolute;
  align-self: center;
  bottom: 0px;
`

type UserVocabularyListScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyList'>
}

const UserVocabularyListScreen = ({ navigation }: UserVocabularyListScreenProps): ReactElement => {
  const vocabularyItems = useReadUserVocabulary()
  const [searchString, setSearchString] = useState<string>('')
  const [editModeEnabled, setEditModeEnabled] = useState<boolean>(false)
  const [vocabularyItemToDelete, setVocabularyItemToDelete] = useState<VocabularyItem | null>(null)
  const { isKeyboardVisible } = useKeyboard()

  const numberOfVocabularyItems = vocabularyItems.data?.length ?? 0
  const sortedAndFilteredVocabularyItems = getSortedAndFilteredVocabularyItems(vocabularyItems.data, searchString)
  const { create, myWords } = getLabels().userVocabulary
  const { list } = getLabels().userVocabulary.overview
  const {
    confirm,
    confirmDeletionPart1,
    confirmDeletionPart2,
    finished,
    edit,
  }: { confirm: string; confirmDeletionPart1: string; confirmDeletionPart2: string; finished: string; edit: string } =
    getLabels().userVocabulary.list

  useFocusEffect(vocabularyItems.refresh)

  const navigateToDetail = (vocabularyItem: VocabularyItem): void => {
    navigation.navigate('VocabularyDetail', { vocabularyItem })
  }

  const toggleEditMode = (): void => {
    setEditModeEnabled(oldValue => !oldValue)
  }

  const openDeleteConfirmationModal = (vocabularyItem: VocabularyItem): void => {
    setVocabularyItemToDelete(vocabularyItem)
  }

  const deleteItem = (vocabularyItem: VocabularyItem | null): void => {
    if (vocabularyItem) {
      deleteUserVocabularyItem(vocabularyItem).then(vocabularyItems.refresh).catch(reportError)
    }
    setVocabularyItemToDelete(null)
  }

  return (
    <RouteWrapper>
      <Modal
        visible={vocabularyItemToDelete !== null}
        onClose={() => setVocabularyItemToDelete(null)}
        text={`${confirmDeletionPart1} "${
          vocabularyItemToDelete !== null ? vocabularyItemToDelete.word : ''
        }" ${confirmDeletionPart2}`}
        confirmationButtonText={confirm}
        confirmationAction={() => deleteItem(vocabularyItemToDelete)}
      />
      <Root>
        <FlatList
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              <Title
                title={myWords}
                description={`${numberOfVocabularyItems} ${
                  numberOfVocabularyItems === 1 ? getLabels().general.word : getLabels().general.words
                }`}
              />
              <SearchBar query={searchString} setQuery={setSearchString} />
              {sortedAndFilteredVocabularyItems.length > 0 && (
                <EditPressable onPress={toggleEditMode}>
                  <ContentTextBold>{editModeEnabled ? finished : edit}</ContentTextBold>
                </EditPressable>
              )}
            </>
          }
          data={sortedAndFilteredVocabularyItems}
          renderItem={({ item }) => (
            <ListItem
              vocabularyItem={item}
              navigateToDetailScreen={() => navigateToDetail(item)}
              navigateToEditScreen={() =>
                navigation.navigate('UserVocabularyProcess', {
                  headerBackLabel: getLabels().userVocabulary.myWords,
                  itemToEdit: item,
                })
              }
              editModeEnabled={editModeEnabled}
              deleteItem={openDeleteConfirmationModal}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyContent vocabularyItems={vocabularyItems} />}
        />
        {!isKeyboardVisible && (
          <ButtonContainer>
            <Button
              onPress={() => navigation.navigate('UserVocabularyProcess', { headerBackLabel: list })}
              label={create}
              buttonTheme={BUTTONS_THEME.contained}
              iconRight={AddIconWhite}
            />
          </ButtonContainer>
        )}
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyListScreen
