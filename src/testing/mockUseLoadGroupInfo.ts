import { mocked } from 'ts-jest/utils'

import { DisciplineType } from '../constants/endpoints'
import { ServerResponse, useLoadGroupInfo } from '../hooks/useLoadGroupInfo'

jest.mock('../hooks/useLoadGroupInfo')

const mockData = (data: unknown): typeof useLoadGroupInfo => {
  return ((apiKey: string) => ({
    data: data,
    loading: false,
    error: null,
    refresh: () => null
  })) as typeof useLoadGroupInfo
}

export const mockUseLoadGroupInfo = (data: DisciplineType): void => {
  mocked(useLoadGroupInfo).mockImplementation(mockData(data))
}
