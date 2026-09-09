import { useState } from 'react'

import { VocabularyNote } from '../constants/data'
import { VocabularyItemId } from '../models/VocabularyItem'
import { getVocabularyNote } from '../services/storageUtils'
import useStorage from './useStorage'

type VocabularyNoteState = {
  note: VocabularyNote | undefined
  isEditorOpen: boolean
  openEditor: () => void
  closeEditor: () => void
}

const useVocabularyNote = (wordId: VocabularyItemId): VocabularyNoteState => {
  const [vocabularyNotes] = useStorage('vocabularyNotes')
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)

  return {
    note: getVocabularyNote(vocabularyNotes, wordId),
    isEditorOpen,
    openEditor: () => setIsEditorOpen(true),
    closeEditor: () => setIsEditorOpen(false),
  }
}

export default useVocabularyNote
