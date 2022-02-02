export const COLORS = {
  primary: '#000e38',
  white: '#ffffff',
  background: '#f9fafb',
  textColor: '#3a4049',
  textSecondaryColor: '#5b616a',
  placeholder: '#777e91',
  disabled: '#e0e4ed',
  secondarySelectedColor: '#f57f7a',
  exerciseProgressIndicator: '#20c5b4',
  containedButtonSelected: '#3d4662',
  overlay: 'rgba(0, 14, 56, 0.8)',
  functionalCorrect: '#0adb75',
  functionalAlmostCorrect: '#ffbb4a',
  functionalIncorrect: '#ff5252',
  audioIconHighlight: '#F1635F',
  audioIconSelected: '#ffa3a3',
  shadow: 'rgba(0, 0, 0, 0.6)',
  lunesArtikelDas: '#72f399',
  lunesArtikelDiePlural: '#eee12d',
  lunesArtikelDie: '#faa7a7',
  lunesArtikelDer: '#8cc8f3',
  blue: '#0000FF',  // not used
  lunesBlueLight: '#97aef1',  // not used
  lunesOrangeLight: '#ffbb4a',  // not used
  lunesGreenLight: '#7ae6d8',  // not used
}

export type Color = typeof COLORS[keyof typeof COLORS]
