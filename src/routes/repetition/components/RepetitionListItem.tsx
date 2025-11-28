import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { CloseIconRed } from '../../../../assets/images'
import Modal from '../../../components/Modal'
import PressableOpacity from '../../../components/PressableOpacity'
import VocabularyListItem from '../../../components/VocabularyListItem'
import theme from '../../../constants/theme'
import VocabularyItem from '../../../models/VocabularyItem'
import { getLabels } from '../../../services/helpers'

const Button = styled(PressableOpacity)`
  padding-right: ${theme => theme.theme.spacings.xs};
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
}: ListItemProps): ReactElement => {
  const [showModal, setShowModal] = useState(false)
  const { modalDeleteText, confirm, abort } = getLabels().repetition.wordList

  return (
    <>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        buttonLayout='horizontal'
        text={modalDeleteText}
        confirmationButtonText={confirm}
        cancelButtonText={abort}
        confirmationAction={() => removeFromRepetition(vocabularyItem)}
      />
      <VocabularyListItem
        vocabularyItem={vocabularyItem}
        onPress={navigateToDetailScreen}
        customActions={
          <Button onPress={() => setShowModal(true)} testID='delete-button'>
            <CloseIconRed width={theme.spacingsPlain.lg} height={theme.spacingsPlain.lg} />
          </Button>
        }
      />
    </>
  )
}

export default RepetitionListItem
