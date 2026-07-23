import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { PenIcon, TrashIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels } from '../../../services/helpers'

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

type ListItemProps<T extends VocabularyItem> = {
  vocabularyItem: T
  navigateToDetailScreen: () => void
  navigateToEditScreen: () => void
  editModeEnabled: boolean
  deleteItem: (vocabularyItem: T) => void
}

const ListItem = <T extends VocabularyItem>({
  vocabularyItem,
  navigateToDetailScreen,
  navigateToEditScreen,
  editModeEnabled,
  deleteItem,
}: ListItemProps<T>): ReactElement => {
  const theme = useTheme()
  return (
    <Container>
      {editModeEnabled && (
        <IconContainer>
          <PressableOpacity
            onPress={() => deleteItem(vocabularyItem)}
            accessibilityLabel={getLabels().userVocabulary.list.delete}
          >
            <TrashIcon testID='trash-icon' color={theme.colors.text} />
          </PressableOpacity>
          <PressableOpacity onPress={navigateToEditScreen} accessibilityLabel={getLabels().userVocabulary.list.edit}>
            <PenIcon color={theme.colors.text} />
          </PressableOpacity>
        </IconContainer>
      )}
      <VocabularyListItemContainer>
        <VocabularyListItem vocabularyItem={vocabularyItem} onPress={navigateToDetailScreen} />
      </VocabularyListItemContainer>
    </Container>
  )
}

export default ListItem
