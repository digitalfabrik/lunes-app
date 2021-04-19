import React from 'react'
import { View } from 'react-native'
import { ITitleProps } from '../interfaces/title'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  title: {
    minHeight: 54,
    alignItems: 'center',
    marginBottom: 32
  }
})

const Title = ({ children }: ITitleProps) => <View style={styles.title}>{children}</View>

export default Title
