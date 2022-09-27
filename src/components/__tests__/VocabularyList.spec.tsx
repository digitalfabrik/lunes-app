import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../services/helpers'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import render from '../../testing/render'
import VocabularyList from '../VocabularyList'

jest.mock('../FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})
jest.mock('../AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const onItemPress = jest.fn()
  const vocabularyItems = new VocabularyItemBuilder(2).build()

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(vocabularyItems)

    const { getByText, getAllByText, getAllByTestId } = render(
      <VocabularyList title='Title' vocabularyItems={vocabularyItems} onItemPress={onItemPress} />
    )

    expect(getByText('Title')).toBeTruthy()
    expect(getByText(`2 ${getLabels().general.words}`)).toBeTruthy()
    expect(getByText('der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })

  it('should call onItemPress with correct index', () => {
    const { getByText } = render(<VocabularyList title='Title' vocabularyItems={vocabularyItems} onItemPress={onItemPress} />)

    expect(onItemPress).toHaveBeenCalledTimes(0)

    fireEvent.press(getByText('Auto'))

    expect(onItemPress).toHaveBeenCalledTimes(1)
    expect(onItemPress).toHaveBeenCalledWith(1)

    fireEvent.press(getByText('Spachtel'))

    expect(onItemPress).toHaveBeenCalledTimes(2)
    expect(onItemPress).toHaveBeenCalledWith(0)
  })
})
