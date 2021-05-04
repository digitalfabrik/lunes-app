import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors'
import { ILoadingProps } from '../interfaces'

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },
  indicator: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
const Loading = ({ children, isLoading }: ILoadingProps) => (
  <View style={styles.root}>
    {isLoading ? (
      <View style={styles.indicator}>
        <ActivityIndicator size='large' color={COLORS.lunesBlack} />
      </View>
    ) : (
      children
    )}
  </View>
)

export default Loading
