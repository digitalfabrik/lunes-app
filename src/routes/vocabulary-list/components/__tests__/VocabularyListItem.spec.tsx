import 'react-native'
import React from 'react'
import VocabularyListItem from '../VocabularyListItem'
import { shallow } from 'enzyme'
import { ARTICLES } from '../../../../constants/data'
import { DocumentType } from '../../../../constants/endpoints'

describe('VocabularyListItem', () => {
  const document: DocumentType = {
    article: ARTICLES[1],
    audio: '',
    id: 0,
    document_image: [{ id: 1, image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg' }],
    word: 'Winkelmesser',
    alternatives: []
  }

  it('should display image passed to it', () => {
    const component = shallow(<VocabularyListItem document={document} />)
    expect(component.find('[testID="image"]').prop('source')).toHaveProperty('uri', document.document_image[0].image)
  })

  it('should display article passed to it', () => {
    const component = shallow(<VocabularyListItem document={document} />)
    expect(component.find('[testID="article"]').props().children).toBe(document.article.value)
  })

  it('should display word passed to it', () => {
    const component = shallow(<VocabularyListItem document={document} />)
    expect(component.find('[testID="word"]').props().children).toBe(document.word)
  })
})
