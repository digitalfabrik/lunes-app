import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export const FONTS = {
  contentFontBold: 'SourceSansPro-SemiBold',
  contentFontRegular: 'SourceSansPro-Regular',
  defaultFontWeight: 600,
  lightFontWeight: 400,
  capsLetterSpacing: '0.4px',
  listTitleLetterSpacing: '0.11px',
  smallFontSize: `${hp('1.5%')}px`, // 12px
  defaultFontSize: `${hp('2%')}px`, // 16px
  defaultFontSizeWithoutUnit: hp('2%'), // 16px
  largeFontSize: `${hp('2.25%')}px`, // 18px
  headingFontSize: `${hp('2.5%')}px`, // 20px
}
