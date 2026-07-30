import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { areVocabularyItemIdsEqual, pronunciationOrWord } from '../VocabularyItem'

describe('VocabularyItem', () => {
  describe('pronunciationOrWord', () => {
    // Item 0 of the builder is 'Spachtel', which needs no special pronunciation
    const vocabularyItem = new VocabularyItemBuilder(1).build()[0]!

    it('should use the pronunciation of a loanword', () => {
      expect(pronunciationOrWord({ ...vocabularyItem, word: 'Baiser', pronunciation: 'Besee' })).toBe('Besee')
    })

    it('should use the word itself when there is no pronunciation', () => {
      expect(pronunciationOrWord(vocabularyItem)).toBe('Spachtel')
    })
  })

  it('should compare two items correctly', () => {
    expect(
      areVocabularyItemIdsEqual({ type: 'user-created', index: 1 }, { index: 1, type: 'user-created' }),
    ).toBeTruthy()
    expect(
      areVocabularyItemIdsEqual({ type: 'user-created', index: 1 }, { index: 2, type: 'user-created' }),
    ).toBeFalsy()
    expect(areVocabularyItemIdsEqual({ type: 'lunes-standard', id: 1 }, { id: 1, type: 'lunes-standard' })).toBeTruthy()
    expect(
      areVocabularyItemIdsEqual(
        { type: 'lunes-standard', id: 1 },
        { protectedId: 1, type: 'lunes-protected', apiKey: 'test' },
      ),
    ).toBeFalsy()
    expect(areVocabularyItemIdsEqual({ type: 'lunes-standard', id: 1 }, { index: 1, type: 'user-created' })).toBeFalsy()
    expect(
      areVocabularyItemIdsEqual(
        { protectedId: 1, apiKey: 'test', type: 'lunes-protected' },
        { protectedId: 1, type: 'lunes-protected', apiKey: 'test' },
      ),
    ).toBeTruthy()
  })
})
