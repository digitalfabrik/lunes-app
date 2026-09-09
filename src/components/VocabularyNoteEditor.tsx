import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { useStorageCache } from '../hooks/useStorage'
import { VocabularyItemId } from '../models/VocabularyItem'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { saveVocabularyNote } from '../services/storageUtils'
import CustomTextInput from './CustomTextInput'
import Modal from './Modal'

const MAX_NOTE_CHARACTERS = 500
const NOTE_INPUT_LINES = 8

const TextInputContainer = styled.View`
  width: 85%;
  margin-bottom: ${props => props.theme.spacings.lg};
`

type VocabularyNoteEditorProps = {
  wordId: VocabularyItemId
  existingText: string | null
  onClose: () => void
}

const VocabularyNoteEditor = ({ wordId, existingText, onClose }: VocabularyNoteEditorProps): ReactElement => {
  const storageCache = useStorageCache()
  const [noteText, setNoteText] = useState<string>(existingText ?? '')
  const [isValidationEnabled, setIsValidationEnabled] = useState<boolean>(existingText !== null)

  const { newNote, edit, languageHint, placeholder, emptyError, cancel, save } = getLabels().notes
  const isNoteBlank = noteText.trim().length === 0

  const changeNoteText = (text: string): void => {
    setNoteText(text)
    setIsValidationEnabled(true)
  }

  const saveNote = (): void => {
    saveVocabularyNote(storageCache, wordId, noteText).catch(reportError)
    onClose()
  }

  return (
    <Modal
      testID='noteEditorModal'
      visible
      onClose={onClose}
      text={existingText === null ? newNote : edit}
      confirmationButtonText={save}
      cancelButtonText={cancel}
      confirmationAction={saveNote}
      confirmationDisabled={isNoteBlank}
    >
      <TextInputContainer>
        <CustomTextInput
          value={noteText}
          onChangeText={changeNoteText}
          placeholder={placeholder}
          lines={NOTE_INPUT_LINES}
          characterLimit={MAX_NOTE_CHARACTERS}
          hint={languageHint}
          errorMessage={isValidationEnabled && isNoteBlank ? emptyError : ''}
          clearable
        />
      </TextInputContainer>
    </Modal>
  )
}

export default VocabularyNoteEditor
