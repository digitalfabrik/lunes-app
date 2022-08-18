import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../constants/labels.json'
import useLoadAllDocuments from '../../hooks/useLoadAllDocuments'
import DocumentBuilder from '../../testing/DocumentBuilder'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import render from '../../testing/render'
import DictionaryScreen from '../DictionaryScreen'

jest.mock('../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('../../hooks/useLoadAllDocuments')

describe('DictionaryScreen', () => {
  const documents = new DocumentBuilder(4).build()
  const navigation = createNavigationMock<'Dictionary'>()

  it('should render correctly', () => {
    mocked(useLoadAllDocuments).mockReturnValueOnce(getReturnOf(documents))
    const { getByText, getByPlaceholderText } = render(<DictionaryScreen navigation={navigation} />)
    expect(getByText(labels.general.dictionary)).toBeDefined()
    expect(getByText(`4 ${labels.general.words}`)).toBeDefined()
    expect(getByPlaceholderText(labels.dictionary.enterWord)).toBeDefined()
    expect(getByText(documents[0].word)).toBeDefined()
    expect(getByText(documents[1].word)).toBeDefined()
    expect(getByText(documents[2].word)).toBeDefined()
    expect(getByText(documents[3].word)).toBeDefined()
  })

  it('should filter by word', () => {
    mocked(useLoadAllDocuments).mockReturnValue(getReturnOf(documents))
    const { queryByText, getByPlaceholderText } = render(<DictionaryScreen navigation={navigation} />)
    const searchBar = getByPlaceholderText(labels.dictionary.enterWord)
    fireEvent.changeText(searchBar, documents[0].word)
    expect(queryByText(documents[0].word)).toBeDefined()
    expect(queryByText(documents[1].word)).toBeNull()
    expect(queryByText(documents[2].word)).toBeNull()
    expect(queryByText(documents[3].word)).toBeNull()
  })

  it('should filter by word and article', () => {
    mocked(useLoadAllDocuments).mockReturnValue(getReturnOf(documents))
    const { queryByText, getByPlaceholderText } = render(<DictionaryScreen navigation={navigation} />)
    const searchBar = getByPlaceholderText(labels.dictionary.enterWord)
    fireEvent.changeText(searchBar, `${documents[0].article.value} ${documents[0].word}`)
    expect(queryByText(documents[0].word)).toBeDefined()
    expect(queryByText(documents[1].word)).toBeNull()
  })

  it('should navigate to DetailScreen', () => {
    mocked(useLoadAllDocuments).mockReturnValue(getReturnOf(documents))
    const { getByText } = render(<DictionaryScreen navigation={navigation} />)
    fireEvent.press(getByText(documents[0].word))
    expect(navigation.navigate).toHaveBeenCalledWith('DictionaryDetail', { document: documents[0] })
  })
})
