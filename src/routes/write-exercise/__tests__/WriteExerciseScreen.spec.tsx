import { mockUseLoadFromEndpointWitData } from '../../../testing/mockUseLoadFromEndpoint'
import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import WriteExerciseScreen from '../WriteExerciseScreen'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'
import labels from '../../../constants/labels.json'
import { ReactTestInstance } from 'react-test-renderer'
import wrapWithTheme from '../../../testing/wrapWithTheme'

jest.mock('../../../components/AudioPlayer', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('WriteExerciseScreen', () => {
  const testDocuments: DocumentTypeFromServer[] = [
    {
      audio: '',
      word: 'Arbeitshose',
      id: 1,
      article: 2,
      document_image: [{ id: 1, image: 'Arbeitshose' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Arbeitsschuhe',
      id: 2,
      article: 4,
      document_image: [{ id: 2, image: 'Arbeitsschuhe' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'WriteExercise'>()
  const route: RouteProp<RoutesParamsType, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
    params: {
      extraParams: {
        documentsLength: 2,
        disciplineID: 0,
        disciplineIcon: 'Icon',
        disciplineTitle: 'Title',
        exercise: 4,
        exerciseDescription: 'Description',
        trainingSet: 'Set',
        trainingSetId: 0,
        level: jest.fn()
      }
    }
  }
  it('should allow to skip an exercise and try it out later', async () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    // @ts-expect-error because typescript does not know FiberNode
    const getUri = (image: ReactTestInstance) => image._fiber.stateNode.props.source.uri

    const { getByRole, getByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    const image = getByRole('image')
    expect(getUri(image)).toBe('Arbeitshose')
    fireEvent.press(getByText(labels.exercises.write.tryLater))
    expect(getUri(image)).toBe('Arbeitsschuhe')
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.next))
    expect(getUri(image)).toBe('Arbeitshose')
  })

  it('should not allow to skip last exercise', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByText, getByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(queryByText('Später versuchen')).not.toBeNull()
    fireEvent.press(getByText('Lösung anzeigen'))
    fireEvent.press(getByText('Nächstes Wort'))
    expect(queryByText('Später versuchen')).toBeNull()
  })
})
