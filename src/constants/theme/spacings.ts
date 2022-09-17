import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

export const SPACINGS_PLAIN = {
  xxs: wp('0.5%'), // 4
  xs: wp('1%'), // 8
  sm: wp('2%'), // 16
  md: wp('3%'), // 24
  lg: wp('4%'), // 32®
  xl: wp('5%'), // 40
  xxl: wp('6%'), // 48
}

// These pixels are calculated for a 800px height mobile screen
export const SPACINGS = {
  xxs: `${SPACINGS_PLAIN.xxs}px`, // 16px
  xs: `${SPACINGS_PLAIN.xs}px`, // 8px
  sm: `${SPACINGS_PLAIN.sm}px`, // 16px
  md: `${SPACINGS_PLAIN.md}px`, // 24px
  lg: `${SPACINGS_PLAIN.lg}px`, // 32px
  xl: `${SPACINGS_PLAIN.xl}px`, // 40px
  xxl: `${SPACINGS_PLAIN.xxl}px`, // 48px
}
