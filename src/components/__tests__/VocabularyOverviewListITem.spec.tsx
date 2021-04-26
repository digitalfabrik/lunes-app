import 'react-native'
import React from 'react'
import VocabularyOverviewListItem, { IVocabularyOverviewListItemProps } from '../VocabularyOverviewListItem'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('Components', () => {
  describe('VocabularyOverviewListItem', () => {
    const defaultListItemProps: IVocabularyOverviewListItemProps = {
      article: '',
      audio: '',
      id: 0,
      image: '',
      word: ''
    }

    it('renders correctly across screens', () => {
      const component = shallow(<VocabularyOverviewListItem {...defaultListItemProps} />)
      expect(toJson(component)).toMatchSnapshot()
    })

    it('should display image passed to it', () => {
      const listItemProps: IVocabularyOverviewListItemProps = {
        ...defaultListItemProps,
        image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg'
      }

      const component = shallow(<VocabularyOverviewListItem {...listItemProps} />)
      expect(component.find('Image').prop('source')).toHaveProperty('uri', listItemProps.image)
    })

    it('should display article passed to it', () => {
      const listItemProps: IVocabularyOverviewListItemProps = {
        ...defaultListItemProps,
        article: 'article'
      }
      const article = 'Article'

      const component = shallow(<VocabularyOverviewListItem {...listItemProps} />)
      expect(component.find('[testID="article"]').props().children).toBe(article)
    })

    it('should display word passed to it', () => {
      const listItemProps: IVocabularyOverviewListItemProps = {
        ...defaultListItemProps,
        word: 'word'
      }
      const word = 'word'

      const component = shallow(<VocabularyOverviewListItem {...listItemProps} />)
      expect(component.find('[testID="word"]').props().children).toBe(word)
    })

    it('should render volume button', () => {
      const listItemProps: IVocabularyOverviewListItemProps = {
        ...defaultListItemProps
      }

      const component = shallow(<VocabularyOverviewListItem {...listItemProps} />)
      expect(component.find('[testID="volume-button"]')).toHaveLength(1)
    })
  })
})
