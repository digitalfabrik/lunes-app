import { mocked } from 'jest-mock'

import useLoadAsync from '../hooks/useLoadAsync'

jest.mock('../hooks/useLoadAsync')

const mockData = (data: unknown): typeof useLoadAsync =>
  (() => ({
    data,
    loading: false,
    error: null,
    refresh: () => null
  })) as typeof useLoadAsync

export const mockUseLoadAsyncWithData = <T>(data: T): void => {
  mocked(useLoadAsync).mockImplementation(mockData(data))
}

export const mockUseLoadAsyncLoading = (): void => {
  const useLoadAsyncMock = (() => ({
    data: null,
    loading: true,
    error: null,
    refresh: () => null
  })) as typeof useLoadAsync
  mocked(useLoadAsync).mockImplementationOnce(useLoadAsyncMock)
}

export const mockUseLoadAsyncWithError = (error: string): void => {
  const useLoadAsyncMock = (() => ({
    data: null,
    loading: false,
    error: new Error(error),
    refresh: () => null
  })) as typeof useLoadAsync
  mocked(useLoadAsync).mockImplementationOnce(useLoadAsyncMock)
}
