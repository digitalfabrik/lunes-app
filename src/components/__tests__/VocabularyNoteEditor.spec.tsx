import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { renderWithStorageCache } from '../../testing/render'
import VocabularyNoteEditor from '../VocabularyNoteEditor'

describe('VocabularyNoteEditor', () => {
  const wordId = new VocabularyItemBuilder(1).build()[0]!.id
  const { newNote, edit, placeholder, emptyError, save } = getLabels().notes

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  const renderEditor = (existingText: string | null) =>
    renderWithStorageCache(
      storageCache,
      <VocabularyNoteEditor wordId={wordId} existingText={existingText} onClose={() => undefined} />,
    )

  describe('for a new note', () => {
    it('should be titled as a new note and start empty', () => {
      const { getByText, getByPlaceholderText } = renderEditor(null)

      expect(getByText(newNote)).toBeDefined()
      expect(getByPlaceholderText(placeholder).props.value).toBe('')
    })

    it('should save what was typed', async () => {
      const { getByText, getByPlaceholderText } = renderEditor(null)

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'Wie das englische Wort'))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toEqual([{ wordId, text: 'Wie das englische Wort' }])
    })

    it('should not save a note that only contains whitespace', async () => {
      const { getByText, getByPlaceholderText } = renderEditor(null)

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), '   '))
      expect(getByText(emptyError)).toBeDefined()

      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(0)
    })

    it('should not show an error before the user has typed', () => {
      const { queryByText } = renderEditor(null)

      expect(queryByText(emptyError)).toBeNull()
    })

    it('should count an emoji as a single character', async () => {
      const { getByText, getByPlaceholderText } = renderEditor(null)

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), '🚧🧱🔧'))

      expect(getByText('3 / 500')).toBeDefined()
    })

    it('should not accept more than 500 characters', async () => {
      const { getByText, getByPlaceholderText } = renderEditor(null)

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'a'.repeat(600)))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')[0]!.text).toHaveLength(500)
    })
  })

  describe('for an existing note', () => {
    it('should be titled as editing and start pre-filled', () => {
      const { getByText, getByPlaceholderText } = renderEditor('Auf der Baustelle gelernt')

      expect(getByText(edit)).toBeDefined()
      expect(getByPlaceholderText(placeholder).props.value).toBe('Auf der Baustelle gelernt')
    })

    it('should replace the note when it is changed', async () => {
      const { getByText, getByPlaceholderText } = renderEditor('Auf der Baustelle gelernt')

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'Im Praktikum gelernt'))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toEqual([{ wordId, text: 'Im Praktikum gelernt' }])
    })

    it('should explain why saving is blocked when the note is cleared', async () => {
      const { getByText, getByPlaceholderText } = renderEditor('Auf der Baustelle gelernt')

      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), ''))

      expect(getByText(emptyError)).toBeDefined()
    })
  })
})
