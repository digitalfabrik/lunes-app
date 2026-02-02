import { areVocabularyItemIdsEqual } from '../VocabularyItem'

describe('VocabularyItem', () => {
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
