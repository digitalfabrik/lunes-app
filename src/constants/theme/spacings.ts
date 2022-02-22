import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

// These pixels are calculated for a 400px width mobile screen
export const SPACINGS = {
  xxs: `${wp('1%')}px`, // 4px
  xs: `${wp('2%')}px`, // 8px
  sm: `${wp('4%')}px`, // 16px
  md: `${wp('6%')}px`, // 24px
  lg: `${wp('8%')}px`, // 32px
  xl: `${wp('10%')}px`, // 40px
  xxl: `${wp('12%')}px` // 48px
}
