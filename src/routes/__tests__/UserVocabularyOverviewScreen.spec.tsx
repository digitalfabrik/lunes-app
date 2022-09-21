import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import UserVocabularyOverviewScreen from '../UserVocabularyOverviewScreen'

jest.mock('@react-navigation/native')
describe('UserVocabularyOverviewScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyOverview'>()
  it('should show content', () => {
    const { getByText } = render(<UserVocabularyOverviewScreen navigation={navigation} />)
    expect(getByText(getLabels().userVocabulary.myWords)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.overview.list)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.create)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.overview.practice)).toBeDefined()
  })
})
