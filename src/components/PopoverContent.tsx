import React from 'react'
import { View, Text } from 'react-native'
import { InfoIcon } from '../../assets/images'
import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { COLORS } from '../constants/colors'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lunesBlack,
    width: wp('80%'),
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 2
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: wp('3.5%'),
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    width: wp('60%'),
    marginLeft: 8
  }
})
const PopoverContent = () => (
  <View style={styles.container}>
    <InfoIcon width={30} height={30} />
    <Text style={styles.message}>Ups, you forgot someting. You have to add an article to continue.</Text>
  </View>
)

export default PopoverContent
