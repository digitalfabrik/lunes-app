export const FONT_SIZES = {
  caption: 12,
  body: 16,
  listTitle: 18,
  heading: 20,
}

const LINE_HEIGHT_RATIOS = {
  heading: 1.2,
  body: 1.5,
  caption: 1.4,
}

// React Native expects an absolute line height, so the ratios are resolved here instead of being passed through
const lineHeightInPx = (fontSize: number, ratio: number): string => `${Math.round(fontSize * ratio)}px`

export const FONTS = {
  contentFontBold: 'SourceSansPro-SemiBold',
  contentFontRegular: 'SourceSansPro-Regular',
  capsLetterSpacing: '0.4px',
  listTitleLetterSpacing: '0.11px',
  smallFontSize: `${FONT_SIZES.caption}px`,
  defaultFontSize: `${FONT_SIZES.body}px`,
  defaultFontSizeWithoutUnit: FONT_SIZES.body,
  largeFontSize: `${FONT_SIZES.listTitle}px`,
  headingFontSize: `${FONT_SIZES.heading}px`,
  lineHeightHeading: lineHeightInPx(FONT_SIZES.heading, LINE_HEIGHT_RATIOS.heading),
  lineHeightListTitle: lineHeightInPx(FONT_SIZES.listTitle, LINE_HEIGHT_RATIOS.heading),
  lineHeightBody: lineHeightInPx(FONT_SIZES.body, LINE_HEIGHT_RATIOS.body),
  lineHeightCaption: lineHeightInPx(FONT_SIZES.caption, LINE_HEIGHT_RATIOS.caption),
}
