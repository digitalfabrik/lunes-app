import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import { saveVocabularyNote } from '../../services/storageUtils'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { renderWithStorageCache } from '../../testing/render'
import VocabularyNoteSection from '../VocabularyNoteSection'

describe('VocabularyNoteSection', () => {
  const wordId = new VocabularyItemBuilder(1).build()[0]!.id
  const { add, edit, delete: deleteLabel, placeholder, confirmDeletion } = getLabels().notes
  const noteText = 'Auf der Baustelle gelernt'

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  const renderSection = () => renderWithStorageCache(storageCache, <VocabularyNoteSection wordId={wordId} />)

  describe('when no note exists', () => {
    it('should offer to add one', () => {
      const { getByText } = renderSection()

      expect(getByText(add)).toBeDefined()
    })

    it('should open the editor for a new note', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))

      expect(getByPlaceholderText(placeholder).props.value).toBe('')
    })
  })

  describe('when a note exists', () => {
    beforeEach(async () => {
      await saveVocabularyNote(storageCache, wordId, noteText)
    })

    it('should show the note without offering to add one', () => {
      const { getByText, queryByText } = renderSection()

      expect(getByText(noteText)).toBeDefined()
      expect(queryByText(add)).toBeNull()
    })

    it('should open the editor when the note itself is tapped', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(noteText)))

      expect(getByPlaceholderText(placeholder).props.value).toBe(noteText)
    })

    it('should open the editor from the edit button', async () => {
      const { getByLabelText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(edit)))

      expect(getByPlaceholderText(placeholder).props.value).toBe(noteText)
    })

    it('should keep the note until the deletion is confirmed', async () => {
      const { getByLabelText, getByText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(deleteLabel)))
      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(1)

      await act(async () => fireEvent.press(getByText(confirmDeletion)))

      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(0)
    })
  })
})
