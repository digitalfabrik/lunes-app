import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import OverviewUserVocabularyScreen from '../OverviewUserVocabularyScreen'

describe('UserVocabularyOverviewScreen', () => {
  const navigation = createNavigationMock<'OverviewUserVocabulary'>()
  it('should show content', () => {
    const { getByText } = render(<OverviewUserVocabularyScreen navigation={navigation} />)
    expect(getByText(getLabels().userVocabulary.myWords)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.overview.list)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.create)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.overview.practice)).toBeDefined()
  })
})
