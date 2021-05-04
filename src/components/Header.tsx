import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SquareIcon, StarIcon, CircleIcon, LinesIcon, SmileIcon } from '../../assets/images'
import { IHeaderProps } from '../interfaces/header'
import { COLORS } from '../constants/colors'

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lunesBlack
  },
  header: {
    backgroundColor: COLORS.lunesBlack,
    height: 91,
    width: '100%'
  },
  squareIcon: {
    position: 'absolute',
    top: 41.5,
    left: 24.3,
    width: 28,
    height: 28
  },
  starIcon: {
    position: 'absolute',
    top: -5,
    left: 98.3,
    width: 28,
    height: 23.5
  },
  circleIcon: {
    position: 'absolute',
    top: 37.5,
    right: 68.8,
    width: 28,
    height: 29
  },
  verticalLinesIcon: {
    position: 'absolute',
    top: 16.5,
    right: 0,
    width: 24.5,
    height: 28
  },
  smileIcon: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: '50%',
    marginLeft: -40,
    top: 51
  }
})
const Header = ({ top }: IHeaderProps) => (
  <View style={{ ...styles.wrapper, paddingTop: top }} testID='header'>
    <View style={styles.header}>
      <View style={styles.squareIcon}>
        <SquareIcon />
      </View>
      <View style={styles.starIcon}>
        <StarIcon />
      </View>
      <View style={styles.circleIcon}>
        <CircleIcon />
      </View>
      <View style={styles.verticalLinesIcon}>
        <LinesIcon />
      </View>
      <View style={styles.smileIcon}>
        <SmileIcon />
      </View>
    </View>
  </View>
)

export default Header
