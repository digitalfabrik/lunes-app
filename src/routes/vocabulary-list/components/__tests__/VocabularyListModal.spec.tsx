import React from 'react'
import VocabularyListModal from '../VocabularyListModal'
import { DocumentsType } from '../../../../constants/endpoints'
import { render, fireEvent } from '@testing-library/react-native'
import labels from '../../../../constants/labels.json'

jest.mock('../../../../components/AudioPlayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyListModal', () => {
  const documents: DocumentsType = [
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
      />
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
      />
    )
    const button = await getByText(labels.general.header.cancelExercise)
    expect(button).toBeDefined()
    await fireEvent.press(button)
    expect(setIsModalVisible).toBeCalledTimes(1)
  })
})
