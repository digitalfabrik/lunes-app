import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import { saveVocabularyNote } from '../../services/storageUtils'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { renderWithStorageCache } from '../../testing/render'
import VocabularyNoteSection from '../VocabularyNoteSection'

describe('VocabularyNoteSection', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]!
  const { add, edit, delete: deleteLabel, placeholder, emptyError, confirm, save } = getLabels().notes

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  const renderSection = () =>
    renderWithStorageCache(storageCache, <VocabularyNoteSection vocabularyItem={vocabularyItem} />)

  describe('when no note exists', () => {
    it('should offer to add one', () => {
      const { getByText } = renderSection()

      expect(getByText(add)).toBeDefined()
    })

    it('should save a typed note', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'Wie das englische Wort'))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toEqual([
        { wordId: vocabularyItem.id, text: 'Wie das englische Wort' },
      ])
    })

    it('should not save a note that only contains whitespace', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), '   '))
      expect(getByText(emptyError)).toBeDefined()

      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(0)
    })

    it('should explain why saving is blocked after clearing what was typed', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'ab'))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), ''))

      expect(getByText(emptyError)).toBeDefined()
    })

    it('should not show an error before the user has typed', async () => {
      const { getByText, queryByText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))

      expect(queryByText(emptyError)).toBeNull()
    })

    it('should count an emoji as a single character', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), '🚧🧱🔧'))

      expect(getByText('3 / 500')).toBeDefined()
    })

    it('should not accept more than 500 characters', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText(add)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'a'.repeat(600)))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')[0]!.text).toHaveLength(500)
    })
  })

  describe('when a note exists', () => {
    beforeEach(async () => {
      await saveVocabularyNote(storageCache, vocabularyItem.id, 'Auf der Baustelle gelernt')
    })

    it('should show the note', () => {
      const { getByText } = renderSection()

      expect(getByText('Auf der Baustelle gelernt')).toBeDefined()
    })

    it('should open the editor when the note itself is tapped', async () => {
      const { getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByText('Auf der Baustelle gelernt')))

      expect(getByPlaceholderText(placeholder).props.value).toBe('Auf der Baustelle gelernt')
    })

    it('should open the editor pre-filled with the existing note', async () => {
      const { getByLabelText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(edit)))

      expect(getByPlaceholderText(placeholder).props.value).toBe('Auf der Baustelle gelernt')
    })

    it('should replace the note when it is edited', async () => {
      const { getByLabelText, getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(edit)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), 'Im Praktikum gelernt'))
      await act(async () => fireEvent.press(getByText(save)))

      expect(storageCache.getItem('vocabularyNotes')).toEqual([
        { wordId: vocabularyItem.id, text: 'Im Praktikum gelernt' },
      ])
    })

    it('should explain why saving is blocked when the note is cleared', async () => {
      const { getByLabelText, getByText, getByPlaceholderText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(edit)))
      await act(async () => fireEvent.changeText(getByPlaceholderText(placeholder), ''))

      expect(getByText(emptyError)).toBeDefined()
    })

    it('should keep the note until the deletion is confirmed', async () => {
      const { getByLabelText, getByText } = renderSection()

      await act(async () => fireEvent.press(getByLabelText(deleteLabel)))
      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(1)

      await act(async () => fireEvent.press(getByText(confirm)))

      expect(storageCache.getItem('vocabularyNotes')).toHaveLength(0)
    })
  })
})
