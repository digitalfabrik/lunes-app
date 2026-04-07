import { NavigationProp } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'

import NavigationHeaderLeft from '../components/NavigationHeaderLeft'
import theme from '../constants/theme'
import { COLORS } from '../constants/theme/colors'
import { RoutesParams } from './NavigationTypes'

const MOBILE_MAX_WIDTH = 550
export const TABLET_HEADER_HEIGHT = 56

export const useTabletHeaderHeight = (): number | undefined => {
  const { width } = useWindowDimensions()
  return width > MOBILE_MAX_WIDTH ? TABLET_HEADER_HEIGHT : undefined
}

const headerStyles = (headerHeight?: number) =>
  StyleSheet.create({
    header: {
      backgroundColor: COLORS.background,
      shadowOpacity: 0,
      elevation: 0,
      borderBottomColor: COLORS.disabled,
      borderBottomWidth: 1,
      height: headerHeight,
    },
    headerRightContainer: {
      paddingHorizontal: theme.spacingsPlain.sm,
      maxWidth: 60,
    },
    headerLeftContainer: {
      flex: 1,
      padding: 0,
    },
    headerTitleContainer: {
      marginHorizontal: 0,
    },
  })

const screenOptions =
  (headerHeight?: number) =>
  (title: string, navigation: NavigationProp<RoutesParams>, isCloseButton = false): StackNavigationOptions => {
    const { header, headerLeftContainer, headerRightContainer, headerTitleContainer } = headerStyles(headerHeight)
    return {
      headerLeft: () => (
        <NavigationHeaderLeft onPress={navigation.goBack} title={title} isCloseButton={isCloseButton} />
      ),
      headerTitle: '',
      headerStyle: header,
      headerRightContainerStyle: headerRightContainer,
      headerLeftContainerStyle: headerLeftContainer,
      headerTitleContainerStyle: headerTitleContainer,
    }
  }

export default screenOptions
