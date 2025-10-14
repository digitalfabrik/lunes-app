import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { PenIcon, TrashIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import { UserVocabularyItem } from '../../../model/VocabularyItem'

const Container = styled.View`
  flex-direction: row;
`

const VocabularyListItemContainer = styled.View`
  flex: 1;
`

const IconContainer = styled.View`
  justify-content: space-around;
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.xxs}
    ${props => props.theme.spacings.xxs};
`

type ListItemProps = {
  vocabularyItem: UserVocabularyItem
  navigateToDetailScreen: () => void
  navigateToEditScreen: () => void
  editModeEnabled: boolean
  deleteItem: (vocabularyItem: UserVocabularyItem) => void
}

const ListItem = ({
  vocabularyItem,
  navigateToDetailScreen,
  navigateToEditScreen,
  editModeEnabled,
  deleteItem,
}: ListItemProps): ReactElement => (
  <Container>
    {editModeEnabled && (
      <IconContainer>
        <PressableOpacity onPress={() => deleteItem(vocabularyItem)}>
          <TrashIcon testID='trash-icon' />
        </PressableOpacity>
        <PressableOpacity onPress={navigateToEditScreen}>
          <PenIcon />
        </PressableOpacity>
      </IconContainer>
    )}
    <VocabularyListItemContainer>
      <VocabularyListItem vocabularyItem={vocabularyItem} onPress={navigateToDetailScreen} />
    </VocabularyListItemContainer>
  </Container>
)

export default ListItem
