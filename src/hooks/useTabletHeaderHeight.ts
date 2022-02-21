import { useWindowDimensions } from 'react-native'

export const useTabletHeaderHeight = (height: number): number | undefined => {
  const { width } = useWindowDimensions()
  const MOBILE_MAX_WIDTH = 550
  return width > MOBILE_MAX_WIDTH ? height : undefined
}
