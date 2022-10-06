import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export const SPACINGS_PLAIN = {
  xxs: hp('0.55%'), // 4
  xs: hp('1.1%'), // 8
  sm: hp('2.2%'), // 16
  md: hp('3.3%'), // 24
  lg: hp('4.4%'), // 32
  xl: hp('5.5%'), // 40
  xxl: hp('6.6%'), // 48
}

// These pixels are calculated for a 710px height mobile screen
export const SPACINGS = {
  xxs: `${SPACINGS_PLAIN.xxs}px`, // 4px
  xs: `${SPACINGS_PLAIN.xs}px`, // 8px
  sm: `${SPACINGS_PLAIN.sm}px`, // 16px
  md: `${SPACINGS_PLAIN.md}px`, // 24px
  lg: `${SPACINGS_PLAIN.lg}px`, // 32px
  xl: `${SPACINGS_PLAIN.xl}px`, // 40px
  xxl: `${SPACINGS_PLAIN.xxl}px`, // 48px
}
