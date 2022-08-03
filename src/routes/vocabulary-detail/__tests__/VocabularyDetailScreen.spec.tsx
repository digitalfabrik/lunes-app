import { CommonActions, RouteProp } from '@react-navigation/native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DocumentBuilder from '../../../testing/DocumentBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import VocabularyDetailScreen from '../VocabularyDetailScreen'

jest.useFakeTimers()

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyDetailScreen', () => {
  const documents = new DocumentBuilder(2).build()

  const getRoute = (documentIndex: number): RouteProp<RoutesParams, 'VocabularyDetail'> => ({
    key: '',
    name: 'VocabularyDetail',
    params: {
      disciplineId: 1,
      disciplineTitle: 'disciplineTitle',
      documents,
      closeExerciseAction: CommonActions.goBack(),
      documentIndex,
    },
  })

  const navigation = createNavigationMock<'VocabularyDetail'>()

  it('should display alternative words', () => {
    const { getByText } = render(<VocabularyDetailScreen route={getRoute(0)} navigation={navigation} />)
    expect(getByText(labels.exercises.vocabularyList.alternativeWords)).toBeDefined()
    expect(
      getByText(
        `${documents[0].alternatives[0].article.value} ${documents[0].alternatives[0].word}, ${documents[0].alternatives[1].article.value} ${documents[0].alternatives[1].word}`
      )
    ).toBeDefined()
    expect(getByText(labels.exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })

  it('should not display alternative words, if word has none', () => {
    const { getByText, queryByText } = render(<VocabularyDetailScreen route={getRoute(1)} navigation={navigation} />)
    expect(queryByText(labels.exercises.vocabularyList.alternativeWords)).toBeNull()
    expect(getByText(labels.exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })
})
