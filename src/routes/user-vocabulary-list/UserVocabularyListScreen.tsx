import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { AddIconWhite } from '../../../assets/images'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import SearchBar from '../../components/SearchBar'
import Title from '../../components/Title'
import VocabularyListItem from '../../components/VocabularyListItem'
import { ContentTextBold } from '../../components/text/Content'
import { BUTTONS_THEME } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import { useIsKeyboardVisible } from '../../hooks/useIsKeyboardVisible'
import useReadUserVocabulary from '../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, getSortedAndFilteredVocabularyItems } from '../../services/helpers'
import ListEmptyContent from './components/ListEmptyContent'

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
  const vocabularyItems = useReadUserVocabulary()
  const [searchString, setSearchString] = useState<string>('')
  const isKeyboardVisible = useIsKeyboardVisible()

  const numberOfDocuments = vocabularyItems.data?.length ?? 0
  const sortedAndFilteredVocabularyItems = getSortedAndFilteredVocabularyItems(vocabularyItems.data, searchString)

  const navigateToDetail = (document: VocabularyItem): void => {
    navigation.navigate('UserVocabularyDetail', { document }) // TODO: routing
  }

  return (
    <RouteWrapper>
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
              <EditPressable>
                <ContentTextBold>{getLabels().userVocabulary.list.edit}</ContentTextBold>
              </EditPressable>
            </>
          }
          data={sortedAndFilteredVocabularyItems}
          renderItem={({ item }) => <VocabularyListItem vocabularyItem={item} onPress={() => navigateToDetail(item)} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyContent vocabularyItems={vocabularyItems} />}
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
