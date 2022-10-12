import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { PenIcon, TrashIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import { Document } from '../../../constants/endpoints'

const Container = styled.View`
  flex-direction: row;
`

const VocabularyListItemContainer = styled.View`
  min-width: ${wp('90%')};
`

const IconContainer = styled.View`
  justify-content: space-around;
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.xxs}
    ${props => props.theme.spacings.xxs};
`

interface Props {
  document: Document
  navigateToDetailScreen: () => void
  navigateToEditScreen: () => void
  editModeEnabled: boolean
  deleteItem: (document: Document) => void
}

const ListItem = ({
  document,
  navigateToDetailScreen,
  navigateToEditScreen,
  editModeEnabled,
  deleteItem,
}: Props): ReactElement => (
  <Container>
    {editModeEnabled && (
      <IconContainer>
        <PressableOpacity onPress={() => deleteItem(document)}>
          <TrashIcon testID='trash-icon' />
        </PressableOpacity>
        <PressableOpacity onPress={navigateToEditScreen}>
          <PenIcon />
        </PressableOpacity>
      </IconContainer>
    )}
    <VocabularyListItemContainer>
      <VocabularyListItem document={document} onPress={navigateToDetailScreen} />
    </VocabularyListItemContainer>
  </Container>
)

export default ListItem
