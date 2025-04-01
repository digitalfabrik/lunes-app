import { fireEvent, RenderResult, waitFor } from '@testing-library/react-native'
import React, { ReactElement } from 'react'

import { RepetitionService, WordNodeCard } from '../../../services/RepetitionService'
import { newDefaultStorage, Storage, StorageContext } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import RepetitionScreen from '../RepetitionScreen'

jest.mock('victory-native')
jest.mock('@react-navigation/native')

const mockedStorageRender = (storage: Storage, ui: ReactElement): RenderResult =>
  render(<StorageContext.Provider value={storage}>{ui}</StorageContext.Provider>)

describe('RepetitionScreen', () => {
  const navigation = createNavigationMock<'Repetition'>()

  it('should render screen correctly', async () => {
    const storage = newDefaultStorage()
    const wordNodeCards: WordNodeCard[] = new VocabularyItemBuilder(2).build().map(item => ({
      word: item,
      section: 1,
      inThisSectionSince: RepetitionService.addDays(new Date(), -1),
    }))
    storage.wordNodeCards.set(wordNodeCards)
    const { getByText, getByTestId } = mockedStorageRender(storage, <RepetitionScreen navigation={navigation} />)
    await waitFor(() => expect(getByText(`2 ${getLabels().repetition.wordsToRepeat.plural}`)).toBeDefined())
    await waitFor(() => expect(getByTestId('repetition-button')).toBeEnabled())
    expect(getByTestId('info-circle-black-icon')).toBeDefined()
    expect(getByText(getLabels().repetition.repeatNow)).toBeDefined()
  })

  it('should disable button correctly', async () => {
    const { getByTestId } = render(<RepetitionScreen navigation={navigation} />)
    await waitFor(() => {
      expect(getByTestId('repetition-button')).toBeDisabled()
    })
  })

  it('should open modal on icon click', async () => {
    const { getByTestId, queryByTestId } = render(<RepetitionScreen navigation={navigation} />)
    const isInfoIconPressed = getByTestId('info-circle-black-icon')
    expect(isInfoIconPressed).toBeDefined()
    expect(queryByTestId('infoModal')).toBeFalsy()
    fireEvent.press(isInfoIconPressed)
    expect(getByTestId('infoModal')).toBeTruthy()
    expect(getByTestId('infoModal').props.visible).toBe(true)
  })
})
