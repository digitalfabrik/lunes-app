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
import { Document } from '../../constants/endpoints'
import { useIsKeyboardVisible } from '../../hooks/useIsKeyboardVisible'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { getLabels, getSortedAndFilteredDocuments } from '../../services/helpers'
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

interface Props {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyList'>
}

const UserVocabularyListScreen = ({ navigation }: Props): ReactElement => {
  const documents = useReadUserVocabulary()
  const [searchString, setSearchString] = useState<string>('')
  const [editModeEnabled, setEditModeEnabled] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const isKeyboardVisible = useIsKeyboardVisible()

  const numberOfDocuments = documents.data?.length ?? 0
  const sortedAndFilteredDocuments = getSortedAndFilteredDocuments(documents.data, searchString)

  // AsyncStorage.addUserDocument(new DocumentBuilder(4).build()[3]) /* TODO remove im LUN-401 */

  const navigateToDetail = (document: Document): void => {
    navigation.navigate('UserVocabularyDetail', { document })
  }

  const toggleEditMode = (): void => {
    setEditModeEnabled(oldValue => !oldValue)
  }

  const openDeleteConfirmationModal = (document: Document): void => {
    setModalVisible(true)
    setDocumentToDelete(document)
  }

  const deleteItem = (document: Document | null): void => {
    if (document) {
      AsyncStorage.deleteUserDocument(document)
        .then(documents.refresh)
        .catch(err => reportError(err))
    }
    setModalVisible(false)
    setDocumentToDelete(null)
  }

  return (
    <RouteWrapper>
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        text={`${getLabels().userVocabulary.list.confirmDeletionPart1} "${
          documentToDelete !== null ? documentToDelete.word : ''
        }" ${getLabels().userVocabulary.list.confirmDeletionPart2}`}
        confirmationButtonText={getLabels().userVocabulary.list.confirm}
        confirmationAction={() => deleteItem(documentToDelete)}
      />
      <Root>
        <FlatList
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              <Title
                title={getLabels().userVocabulary.myWords}
                description={`${numberOfDocuments} ${
                  numberOfDocuments === 1 ? getLabels().general.word : getLabels().general.words
                }`}
              />
              <SearchBar query={searchString} setQuery={setSearchString} />
              <EditPressable onPress={toggleEditMode}>
                <ContentTextBold>
                  {editModeEnabled ? getLabels().userVocabulary.list.finished : getLabels().userVocabulary.list.edit}
                </ContentTextBold>
              </EditPressable>
            </>
          }
          data={sortedAndFilteredDocuments}
          renderItem={({ item }) => (
            <ListItem
              document={item}
              navigateToDetailScreen={() => navigateToDetail(item)}
              navigateToEditScreen={() => navigation.navigate('UserVocabularyOverview')} /* TODO LUN-401 */
              editModeEnabled={editModeEnabled}
              deleteItem={openDeleteConfirmationModal}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyContent documents={documents} />}
        />
        {!isKeyboardVisible && (
          <ButtonContainer>
            <Button
              onPress={() => navigation.navigate('UserVocabularyOverview')}
              label={getLabels().userVocabulary.create}
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
