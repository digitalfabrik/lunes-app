import { fireEvent } from '@testing-library/react-native'
import React, { ComponentProps } from 'react'

import VocabularyList from '../../components/VocabularyList'
import VocabularyListModal from '../../components/VocabularyListModal'
import labels from '../../constants/labels.json'
import DocumentBuilder from '../../testing/DocumentBuilder'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import render from '../../testing/render'

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

// fix that the modal appears in the test tree even though it is not visible
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal')
  // @ts-expect-error test
  return props => <Modal {...props} />
})

// the modal always lies on top of the route meaning you'll also find the texts below
// therefore prefix the word with modal_
// requireing the actual modal fixes that the modal appears in the test tree
// even though it is not visible

jest.mock('../components/VocabularyListModal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal')
  const Text = require('react-native').Text
  return ({ isModalVisible, documents, selectedDocumentIndex }: ComponentProps<typeof VocabularyListModal>) => (
    <Modal visible={isModalVisible}>
      <Text>{`modal_${documents[selectedDocumentIndex].word}`}</Text>
    </Modal>
  )
})

describe('VocabularyList', () => {
  const documents = new DocumentBuilder(2).build()

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(documents)

    const { getByText, getAllByText, getAllByTestId } = render(<VocabularyList documents={documents} />)

    expect(getByText(labels.exercises.vocabularyList.title)).toBeTruthy()
    expect(getByText(`2 ${labels.general.words}`)).toBeTruthy()
    expect(getByText('Der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('Das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })

  it('should open vocabulary modal when pressing vocabulary', () => {
    const { getByText } = render(<VocabularyList documents={documents} />)

    const vocabulary = getByText('Auto')
    fireEvent.press(vocabulary)

    // see mock above
    expect(getByText('modal_Auto')).toBeTruthy()
  })
})
