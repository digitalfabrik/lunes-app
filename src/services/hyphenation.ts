import { hyphenateSync } from 'hyphen/de'
import { TextProps } from 'react-native'

// Shorter words fit on one line even in the narrowest word list row.
const MIN_WORD_LENGTH_TO_HYPHENATE = 13

export const hyphenate = (text: string): string => hyphenateSync(text, { minWordLength: MIN_WORD_LENGTH_TO_HYPHENATE })

// Android breaks at soft hyphens only while its own hyphenation is enabled, which it is not by
// default. See https://github.com/facebook/react-native/issues/28279.
export const hyphenated = (
  text: string,
): Pick<TextProps, 'accessibilityLabel' | 'android_hyphenationFrequency' | 'children'> => ({
  accessibilityLabel: text,
  android_hyphenationFrequency: 'normal',
  children: hyphenate(text),
})
