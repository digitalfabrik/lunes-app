import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { PenIcon, TrashIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import { VocabularyItem } from '../../../constants/endpoints'

const Container = styled.View`
  flex-direction: row;
`

const IconContainer = styled.View`
  justify-content: space-around;
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.xxs}
    ${props => props.theme.spacings.xxs};
`

interface ListItemProps {
  vocabularyItem: VocabularyItem
  navigateToDetailScreen: () => void
  navigateToEditScreen: () => void
  editModeEnabled: boolean
  deleteItem: (vocabularyItem: VocabularyItem) => void
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
    <VocabularyListItem vocabularyItem={vocabularyItem} onPress={navigateToDetailScreen} />
  </Container>
)

export default ListItem
