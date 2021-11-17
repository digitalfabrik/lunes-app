import { useHeaderHeight } from '@react-navigation/stack'
import { StatusBar, useWindowDimensions } from 'react-native'

/**
 * This hook returns the screen height without navigation header and notification bar
 * For IOS there are no proper libraries or ways to receive status bar height, so the default height of ios is used
 */

const DEFAULT_IOS_STATUS_BAR_HEIGHT = 20
const useScreenHeight = (): number => {
  const { height: deviceHeight } = useWindowDimensions()
  const statusBarHeight = StatusBar.currentHeight ?? DEFAULT_IOS_STATUS_BAR_HEIGHT
  return deviceHeight - useHeaderHeight() - statusBarHeight
}

export default useScreenHeight
