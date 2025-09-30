import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import { VocabularyItem } from '../../../constants/endpoints'
import theme from '../../../constants/theme'

const Button = styled(PressableOpacity)`
  shadow-color: ${props => props.theme.colors.shadow};
  shadow-radius: 5px;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.5;
`

type ListItemProps = {
  vocabularyItem: VocabularyItem
  navigateToDetailScreen: () => void
  removeFromRepetition: (vocabularyItem: VocabularyItem) => void
}

const RepetitionListItem = ({
  vocabularyItem,
  navigateToDetailScreen,
  removeFromRepetition,
}: ListItemProps): ReactElement => (
  <VocabularyListItem
    vocabularyItem={vocabularyItem}
    onPress={navigateToDetailScreen}
    customActions={
      <Button onPress={() => removeFromRepetition(vocabularyItem)} testID='delete-button'>
        <CloseIconRed width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
      </Button>
    }
  />
)

export default RepetitionListItem
