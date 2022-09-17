import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

export const SPACINGS_PLAIN = {
  xxs: wp('1%'), // 4
  xs: wp('2%'), // 8
  sm: wp('4%'), // 16
  md: wp('6%'), // 24
  lg: wp('8%'), // 32
  xl: wp('10%'), // 40
  xxl: wp('12%'), // 48
}

// These pixels are calculated for a 400px width mobile screen
export const SPACINGS = {
  xxs: `${SPACINGS_PLAIN.xxs}px`, // 4px
  xs: `${SPACINGS_PLAIN.xs}px`, // 8px
  sm: `${SPACINGS_PLAIN.sm}px`, // 16px
  md: `${SPACINGS_PLAIN.md}px`, // 24px
  lg: `${SPACINGS_PLAIN.lg}px`, // 32px
  xl: `${SPACINGS_PLAIN.xl}px`, // 40px
  xxl: `${SPACINGS_PLAIN.xxl}px`, // 48px
}
