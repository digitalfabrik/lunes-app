import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { openSettings } from 'react-native-permissions'

import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import NotAuthorisedView from '../NotAuthorisedView'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('NotAuthorisedView', () => {
  const setVisible = jest.fn()

  it('should render description', () => {
    const { getByText } = render(
      <NotAuthorisedView
        setVisible={setVisible}
        description={getLabels().general.camera.noAuthorization.description}
      />,
    )
    const isNoAuthDescription = getByText(getLabels().general.camera.noAuthorization.description)
    expect(isNoAuthDescription).toBeTruthy()
  })

  it('should successfully go back', () => {
    const { getByText } = render(
      <NotAuthorisedView
        setVisible={setVisible}
        description={getLabels().general.camera.noAuthorization.description}
      />,
    )
    const buttonVisible = getByText(getLabels().general.back)
    fireEvent.press(buttonVisible)
    expect(getByText(getLabels().general.back)).toBeDefined()
  })

  it('should open settings successfully', () => {
    const { getByText } = render(
      <NotAuthorisedView
        setVisible={setVisible}
        description={getLabels().general.camera.noAuthorization.description}
      />,
    )
    const message = getByText(getLabels().settings.settings)
    fireEvent.press(message)
    expect(openSettings).toBeDefined()
  })
})
