import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import OverviewUserVocabularyScreen from '../OverviewUserVocabularyScreen'

describe('UserVocabularyOverviewScreen', () => {
  const navigation = createNavigationMock<'OverviewUserVocabulary'>()
  it('should show content', () => {
    const { getByText } = render(<OverviewUserVocabularyScreen navigation={navigation} />)
    expect(getByText(getLabels().ownVocabulary.myWords)).toBeDefined()
    expect(getByText(getLabels().ownVocabulary.overview.list)).toBeDefined()
    expect(getByText(getLabels().ownVocabulary.overview.create)).toBeDefined()
    expect(getByText(getLabels().ownVocabulary.overview.practice)).toBeDefined()
  })
})
