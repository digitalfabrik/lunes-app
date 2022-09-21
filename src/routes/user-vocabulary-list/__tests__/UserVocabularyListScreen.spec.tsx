import { mocked } from 'jest-mock'
import React from 'react'

import useReadUserVocabulary from '../../../hooks/useReadUserVocabulary'
import { getLabels } from '../../../services/helpers'
import DocumentBuilder from '../../../testing/DocumentBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import render from '../../../testing/render'
import UserVocabularyListScreen from '../UserVocabularyListScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadUserVocabulary')

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})

describe('UserVocabularyListScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyList'>()
  const userDocuments = new DocumentBuilder(2).build()

  it('should render list correctly', () => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf(userDocuments))
    const { getByText, getByPlaceholderText } = render(<UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(`2 ${getLabels().general.words}`)).toBeDefined()
    expect(getByPlaceholderText(getLabels().search.enterWord)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.edit)).toBeDefined()
    expect(getByText(userDocuments[0].word)).toBeDefined()
    expect(getByText(userDocuments[1].word)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.create)).toBeDefined()
  })

  it('should render empty list correctly', () => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf([]))
    const { getByText } = render(<UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(`0 ${getLabels().general.words}`)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.noWordsYet)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.create)).toBeDefined()
  })
})
