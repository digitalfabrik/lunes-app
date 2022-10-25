import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import useReadUserVocabulary from '../../../hooks/useReadUserVocabulary'
import { deleteUserVocabularyItem } from '../../../services/AsyncStorage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import render from '../../../testing/render'
import UserVocabularyListScreen from '../UserVocabularyListScreen'

jest.mock('../../../hooks/useReadUserVocabulary')
jest.mock('@react-navigation/native')

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})

jest.mock('../../../services/AsyncStorage', () => ({
  deleteUserVocabularyItem: jest.fn(() => Promise.resolve()),
}))

describe('UserVocabularyListScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyList'>()
  const userVocabularyItems = new VocabularyItemBuilder(2).build()

  it('should render list correctly', () => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf(userVocabularyItems))
    const { getByText, getByPlaceholderText } = render(<UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(`2 ${getLabels().general.words}`)).toBeDefined()
    expect(getByPlaceholderText(getLabels().search.enterWord)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.edit)).toBeDefined()
    expect(getByText(userVocabularyItems[0].word)).toBeDefined()
    expect(getByText(userVocabularyItems[1].word)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.create)).toBeDefined()
  })

  it('should render empty list correctly', () => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf([]))
    const { getByText } = render(<UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(`0 ${getLabels().general.words}`)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.noWordsYet)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.create)).toBeDefined()
  })

  it('should delete item', async () => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf(userVocabularyItems))
    const { getByText, getAllByTestId } = render(<UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(userVocabularyItems[0].word)).toBeDefined()
    const editButton = getByText(getLabels().userVocabulary.list.edit)
    expect(editButton).toBeDefined()
    fireEvent.press(editButton)

    const trashIcons = getAllByTestId('trash-icon')
    expect(trashIcons).toHaveLength(2)

    fireEvent.press(trashIcons[0])
    const confirmButton = getByText(getLabels().userVocabulary.list.confirm)
    fireEvent.press(confirmButton)

    expect(deleteUserVocabularyItem).toHaveBeenCalled()
  })
})
