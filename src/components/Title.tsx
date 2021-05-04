import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ITitleProps } from '../interfaces/title'

export const styles = StyleSheet.create({
  title: {
    minHeight: 54,
    alignItems: 'center',
    marginBottom: 32
  }
})

const Title = ({ children }: ITitleProps) => <View style={styles.title}>{children}</View>

export default Title
