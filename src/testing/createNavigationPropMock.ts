import { StackNavigationProp } from "@react-navigation/stack"
import { RoutesParamsType } from "../navigation/NavigationTypes"

const createNavigationMock = <T extends keyof RoutesParamsType>(routeIndex = 0): StackNavigationProp<RoutesParamsType, T> => ({
  dispatch: jest.fn(),
  canGoBack: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    index: routeIndex,
    routes: [{ key: 'some-key-0', name: 'Home' }],
    key: 'some-key-0',
    routeNames: ['Home'],
    type: 'stack',
    stale: false
  })),
  navigate: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  isFocused: jest.fn(),
  reset: jest.fn(),
  removeListener: jest.fn(),
  setOptions: jest.fn()
})

export default createNavigationMock