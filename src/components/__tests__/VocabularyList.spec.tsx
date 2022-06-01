import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import DocumentBuilder from '../../testing/DocumentBuilder'
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
  const documents = new DocumentBuilder(2).build()

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(documents)

    const { getByText, getAllByText, getAllByTestId } = render(
      <VocabularyList title='Title' documents={documents} onItemPress={onItemPress} />
    )

    expect(getByText(labels.exercises.vocabularyList.title)).toBeTruthy()
    expect(getByText(`2 ${labels.general.words}`)).toBeTruthy()
    expect(getByText('Der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('Das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })

  it('should call onItemPress with correct index', () => {
    const { getByText } = render(<VocabularyList title='Title' documents={documents} onItemPress={onItemPress} />)

    expect(onItemPress).toHaveBeenCalledTimes(0)

    fireEvent.press(getByText('Auto'))

    expect(onItemPress).toHaveBeenCalledTimes(1)
    expect(onItemPress).toHaveBeenCalledWith(1)

    fireEvent.press(getByText('Spachtel'))

    expect(onItemPress).toHaveBeenCalledTimes(2)
    expect(onItemPress).toHaveBeenCalledWith(0)
  })
})
