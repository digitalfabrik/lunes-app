import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  title: {
    minHeight: 54,
    alignItems: 'center',
    marginBottom: 32
  }
})

export interface ITitleProps {
  children: ReactElement
}

const Title = ({ children }: ITitleProps) => <View style={styles.title}>{children}</View>

export default Title
