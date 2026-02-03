import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { StandardJob } from '../../models/Job'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getUnitsOfJob } from '../../services/CmsApi'
import createNavigationMock from '../../testing/createNavigationPropMock'
import mockUnits from '../../testing/mockUnit'
import render from '../../testing/render'
import UnitSelectionScreen from '../UnitSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../services/CmsApi')

describe('UnitSelectionScreen', () => {
  const navigation = createNavigationMock<'UnitSelection'>()
  const job: StandardJob = {
    id: { id: 0, type: 'standard' },
    name: 'Job',
    icon: null,
    numberOfUnits: 1,
    migrated: true,
  }

  const route: RouteProp<RoutesParams, 'UnitSelection'> = {
    key: 'key-1',
    name: 'UnitSelection',
    params: { job },
  }

  it('should display the correct title', async () => {
    mocked(getUnitsOfJob).mockReturnValueOnce(Promise.resolve(mockUnits))

    const { getByText } = render(<UnitSelectionScreen route={route} navigation={navigation} />)
    const title = await waitFor(() => getByText(mockUnits[0].title))
    expect(title).toBeDefined()
  })

  it('should display all units', async () => {
    mocked(getUnitsOfJob).mockReturnValueOnce(Promise.resolve(mockUnits))

    const { getByText } = render(<UnitSelectionScreen route={route} navigation={navigation} />)

    const firstUnit = await waitFor(() => getByText(mockUnits[0].title))
    const secondUnit = getByText(mockUnits[1].title)
    const thirdUnit = getByText(mockUnits[2].title)
    expect(firstUnit).toBeDefined()
    expect(secondUnit).toBeDefined()
    expect(thirdUnit).toBeDefined()
  })

  it('should navigate to exercises when list item pressed', async () => {
    mocked(getUnitsOfJob).mockReturnValueOnce(Promise.resolve(mockUnits))

    const { getByText } = render(<UnitSelectionScreen route={route} navigation={navigation} />)
    const unit = await waitFor(() => getByText(mockUnits[2].title))
    expect(unit).toBeDefined()
    fireEvent.press(unit)

    expect(navigation.navigate).toHaveBeenCalledWith('StandardExercises', expect.anything())
  })
})
