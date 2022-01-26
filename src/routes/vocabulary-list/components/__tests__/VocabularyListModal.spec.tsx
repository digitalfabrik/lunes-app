import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { Documents } from '../../../../constants/endpoints'
import labels from '../../../../constants/labels.json'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import VocabularyListModal from '../VocabularyListModal'

jest.mock('../../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyListModal', () => {
  const documents: Documents = [
    {
      id: 1,
      word: 'Hammer',
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [],
      audio: 'string',
      alternatives: []
    },
    {
      id: 2,
      word: 'Nagel',
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [],
      audio: '',
      alternatives: []
    }
  ]

  const setIsModalVisible = jest.fn()
  const setSelectedDocumentIndex = jest.fn()

  it('should update current document', async () => {
    const { getByText } = render(
      <VocabularyListModal
        documents={documents}
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        selectedDocumentIndex={0}
        setSelectedDocumentIndex={setSelectedDocumentIndex}
      />,
      { wrapper: wrapWithTheme }
    )
    const button = await getByText(labels.exercises.next)
    expect(button).toBeDefined()
    await fireEvent.press(button)
    expect(setSelectedDocumentIndex).toBeCalledTimes(1)
  })

  it('should close modal for last word', async () => {
    const { getByText } = render(
      <VocabularyListModal
        documents={documents}
        isModalVisible={true}
        setIsModalVisible={setIsModalVisible}
        selectedDocumentIndex={1}
        setSelectedDocumentIndex={setSelectedDocumentIndex}
      />,
      { wrapper: wrapWithTheme }
    )
    const button = await getByText(labels.general.header.cancelExercise)
    expect(button).toBeDefined()
    await fireEvent.press(button)
    expect(setIsModalVisible).toBeCalledTimes(1)
  })
})
