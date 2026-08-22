import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import UserVocabularyOverviewScreen from '../UserVocabularyOverviewScreen'

describe('UserVocabularyOverviewScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyOverview'>()
  it('should show content', () => {
    const { title, description, list, listDescription, create, practice, practiceDescription } =
      getLabels().userVocabulary.overview
    const { getByText } = render(<UserVocabularyOverviewScreen navigation={navigation} />)
    expect(getByText(title)).toBeDefined()
    expect(getByText(description)).toBeDefined()
    expect(getByText(list)).toBeDefined()
    expect(getByText(listDescription)).toBeDefined()
    expect(getByText(create)).toBeDefined()
    expect(getByText(practice)).toBeDefined()
    expect(getByText(practiceDescription)).toBeDefined()
  })
})
