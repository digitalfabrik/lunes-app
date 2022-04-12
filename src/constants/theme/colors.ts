export const COLORS = {
  primary: '#000e38',
  backgroundAccent: '#ffffff',
  background: '#f9fafb',
  text: '#3a4049',
  textSecondary: '#5b616a',
  placeholder: '#777e91',
  disabled: '#e0e4ed',
  progressIndicator: '#20c5b4',
  containedButtonSelected: '#3d4662',
  buttonSelectedSecondary: '#f57f7a',
  overlay: 'rgba(0, 14, 56, 0.8)',
  correct: '#0adb75',
  almostCorrect: '#ffbb4a',
  incorrect: '#ff5252',
  audioIconHighlight: '#F1635F',
  audioIconSelected: '#ffa3a3',
  shadow: 'rgba(0, 0, 0, 0.6)',
  articleNeutral: '#72f399',
  articlePlural: '#eee12d',
  articleFeminine: '#faa7a7',
  articleMasculine: '#8cc8f3',
  link: 'blue'
}

export type Color = typeof COLORS[keyof typeof COLORS]
