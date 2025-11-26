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

describe('DisciplineSelectionScreen', () => {
  const navigation = createNavigationMock<'UnitSelection'>()
  const job: StandardJob = {
    id: { id: 0, type: 'standard' },
    name: 'Parent Discipline',
    icon: null,
    numberUnits: 1,
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

  it('should display all disciplines', async () => {
    mocked(getUnitsOfJob).mockReturnValueOnce(Promise.resolve(mockUnits))

    const { getByText } = render(<UnitSelectionScreen route={route} navigation={navigation} />)

    const firstDiscipline = await waitFor(() => getByText(mockUnits[0].title))
    const secondDiscipline = getByText(mockUnits[1].title)
    const thirdDiscipline = getByText(mockUnits[2].title)
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })

  it('should navigate to exercises when list item pressed', async () => {
    mocked(getUnitsOfJob).mockReturnValueOnce(Promise.resolve(mockUnits))

    const { getByText } = render(<UnitSelectionScreen route={route} navigation={navigation} />)
    const discipline = await waitFor(() => getByText(mockUnits[2].title))
    expect(discipline).toBeDefined()
    fireEvent.press(discipline)

    expect(navigation.navigate).toHaveBeenCalledWith('StandardExercises', expect.anything())
  })
})
