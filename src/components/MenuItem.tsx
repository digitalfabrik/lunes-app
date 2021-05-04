import React from 'react'
import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import { Arrow } from '../../assets/images'
import { COLORS } from '../constants/colors'
import { IMenuItemProps } from '../interfaces/menuItem'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16 },
  container: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2
  },
  clickedContainer: {
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: 17,
    paddingRight: 8,
    paddingLeft: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white
  },
  itemTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  clickedItemTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.white,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  icon: {
    justifyContent: 'center',
    marginRight: 10,
    width: wp('7%'),
    height: wp('7%')
  },
  left: { flexDirection: 'row', alignItems: 'center' }
})

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps) => {
  const itemStyle = selected ? styles.clickedContainer : styles.container
  const itemTitleStyle = selected ? styles.clickedItemTitle : styles.itemTitle

  return (
    <View style={styles.wrapper}>
      <Pressable style={itemStyle} onPress={onPress}>
        <View style={styles.left}>
          <Image source={{ uri: icon }} style={styles.icon} />

          <View>
            <Text style={itemTitleStyle} testID='title'>
              {title}
            </Text>
            {children}
          </View>
        </View>

        <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
      </Pressable>
    </View>
  )
}

export default MenuItem
