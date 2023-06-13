import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import useGetAllWords from '../../../hooks/useGetAllWords'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import render from '../../../testing/render'
import SearchScreen from '../SearchScreen'

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('../../../hooks/useGetAllWords')
jest.mock('@react-navigation/native')

describe('SearchScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(4).build()
  const navigation = createNavigationMock<'Search'>()

  it('should render correctly', () => {
    mocked(useGetAllWords).mockReturnValueOnce(getReturnOf(vocabularyItems))
    const { getByText, getByPlaceholderText } = render(<SearchScreen navigation={navigation} />)
    expect(getByText(getLabels().general.search)).toBeDefined()
    expect(getByText(`4 ${getLabels().general.words}`)).toBeDefined()
    expect(getByPlaceholderText(getLabels().search.enterWord)).toBeDefined()
    expect(getByText(vocabularyItems[0].word)).toBeDefined()
    expect(getByText(vocabularyItems[1].word)).toBeDefined()
    expect(getByText(vocabularyItems[2].word)).toBeDefined()
    expect(getByText(vocabularyItems[3].word)).toBeDefined()
  })

  it('should filter by word', () => {
    mocked(useGetAllWords).mockReturnValue(getReturnOf(vocabularyItems))
    const { queryByText, getByPlaceholderText } = render(<SearchScreen navigation={navigation} />)
    const searchBar = getByPlaceholderText(getLabels().search.enterWord)
    fireEvent.changeText(searchBar, vocabularyItems[0].word)
    expect(queryByText(vocabularyItems[0].word)).toBeDefined()
    expect(queryByText(vocabularyItems[1].word)).toBeNull()
    expect(queryByText(vocabularyItems[2].word)).toBeNull()
    expect(queryByText(vocabularyItems[3].word)).toBeNull()
  })

  it('should filter by word and article', () => {
    mocked(useGetAllWords).mockReturnValue(getReturnOf(vocabularyItems))
    const { queryByText, getByPlaceholderText } = render(<SearchScreen navigation={navigation} />)
    const searchBar = getByPlaceholderText(getLabels().search.enterWord)
    fireEvent.changeText(searchBar, `${vocabularyItems[0].article.value} ${vocabularyItems[0].word}`)
    expect(queryByText(vocabularyItems[0].word)).toBeDefined()
    expect(queryByText(vocabularyItems[1].word)).toBeNull()
  })

  it('should navigate to DetailScreen', () => {
    mocked(useGetAllWords).mockReturnValue(getReturnOf(vocabularyItems))
    const { getByText } = render(<SearchScreen navigation={navigation} />)
    fireEvent.press(getByText(vocabularyItems[0].word))
    expect(navigation.navigate).toHaveBeenCalledWith('VocabularyDetail', { vocabularyItem: vocabularyItems[0] })
  })
})
