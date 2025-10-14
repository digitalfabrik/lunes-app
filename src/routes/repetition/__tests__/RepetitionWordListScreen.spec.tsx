import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { RepetitionService, WordNodeCard } from '../../../services/RepetitionService'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import RepetitionWordListScreen from '../RepetitionWordListScreen'

const dummyStorageCache = async (): Promise<StorageCache> => {
  const storageCache = StorageCache.createDummy()
  const words = new VocabularyItemBuilder(2).buildUserVocabulary()
  await storageCache.setItem('userVocabulary', words)
  const wordNodeCards: WordNodeCard[] = words.map(item => ({
    wordRef: item.ref,
    section: 1,
    inThisSectionSince: RepetitionService.addDays(new Date(), -1),
  }))
  await storageCache.setItem('wordNodeCards', wordNodeCards)
  return storageCache
}

describe('RepetitionWordListScreen', () => {
  const navigation = createNavigationMock<'RepetitionWordList'>()

  it('should render correctly', async () => {
    const storageCache = await dummyStorageCache()
    const { getAllByTestId, getByText } = renderWithStorageCache(
      storageCache,
      <RepetitionWordListScreen navigation={navigation} />,
    )

    await waitFor(() => expect(getAllByTestId('list-item')).toHaveLength(2))
    expect(getByText(`2 ${getLabels().general.word.plural}`)).toBeDefined()
  })

  it('should correctly remove words', async () => {
    const storageCache = await dummyStorageCache()
    const { getAllByTestId, getByText, queryByText } = renderWithStorageCache(
      storageCache,
      <RepetitionWordListScreen navigation={navigation} />,
    )

    const words = storageCache.getItem('userVocabulary')

    const deleteButtons = await waitFor(() => getAllByTestId('delete-button'))
    expect(deleteButtons).toHaveLength(2)

    expect(getByText(words[0].word)).toBeDefined()
    fireEvent.press(deleteButtons[0])

    expect(getByText(words[1].word)).toBeDefined()

    const confirmButton = getByText(getLabels().repetition.wordList.confirm)
    expect(confirmButton).toBeDefined()
    fireEvent.press(confirmButton)

    await waitFor(() => expect(queryByText(words[0].word)).toBeNull())

    const newDeleteButtons = getAllByTestId('delete-button')
    expect(newDeleteButtons).toHaveLength(1)

    fireEvent.press(newDeleteButtons[0])
    const confirmButton2 = getByText(getLabels().repetition.wordList.confirm)
    expect(confirmButton2).toBeDefined()
    fireEvent.press(confirmButton2)
    await waitFor(() => expect(getByText(getLabels().repetition.wordList.empty)).toBeDefined())
  })
})
