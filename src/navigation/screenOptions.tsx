import { NavigationProp } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import NavigationHeaderLeft from '../components/NavigationHeaderLeft'
import { COLORS } from '../constants/theme/colors'
import { RoutesParams } from './NavigationTypes'

export const headerHeightPercentage = wp('15%')

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
      paddingHorizontal: wp('4%'),
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
