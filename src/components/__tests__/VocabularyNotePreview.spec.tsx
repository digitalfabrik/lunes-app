import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import { saveVocabularyNote } from '../../services/storageUtils'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { renderWithStorageCache } from '../../testing/render'
import VocabularyNotePreview from '../VocabularyNotePreview'

describe('VocabularyNotePreview', () => {
  const wordId = new VocabularyItemBuilder(1).build()[0]!.id
  const { add, edit, heading, showMore, placeholder } = getLabels().notes
  const noteText = 'Auf der Baustelle gelernt'

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  const renderResult = () => renderWithStorageCache(storageCache, <VocabularyNotePreview wordId={wordId} />)

  describe('when no note exists', () => {
    it('should offer to add one without showing the section', () => {
      const { getByText, queryByText } = renderResult()

      expect(getByText(add)).toBeDefined()
      expect(queryByText(heading)).toBeNull()
    })

    it('should open the editor for a new note', async () => {
      const result = renderResult()

      await act(async () => fireEvent.press(result.getByText(add)))

      expect(result.getByPlaceholderText(placeholder).props.value).toBe('')
    })
  })

  describe('when a note exists', () => {
    beforeEach(async () => {
      await saveVocabularyNote(storageCache, wordId, noteText)
    })

    it('should show the note under its heading', () => {
      const { getByText } = renderResult()

      expect(getByText(heading)).toBeDefined()
      expect(getByText(noteText)).toBeDefined()
    })

    it('should offer to show more only when the note does not fit', () => {
      const { getByText, queryByText } = renderResult()
      const layOutInLines = (count: number) =>
        fireEvent(getByText(noteText), 'textLayout', { nativeEvent: { lines: Array(count).fill({}) } })

      act(() => layOutInLines(2))
      expect(queryByText(showMore)).toBeNull()

      act(() => layOutInLines(3))

      expect(getByText(showMore)).toBeDefined()
    })

    it('should open the editor pre-filled when tapped', async () => {
      const result = renderResult()

      await act(async () => fireEvent.press(result.getByLabelText(edit)))

      expect(result.getByPlaceholderText(placeholder).props.value).toBe(noteText)
    })
  })
})
