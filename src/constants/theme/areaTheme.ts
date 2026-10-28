import theme, { Theme } from '.'

import ContentArea from '../../models/ContentArea'
import { getContrastRatio, MIN_CONTRAST_RATIO } from './contrast'

const getReadableTextColor = (backgroundColor: string, lightTextColor: string): string =>
  getContrastRatio(lightTextColor, backgroundColor) >= MIN_CONTRAST_RATIO ? lightTextColor : theme.colors.black

const getAreaTheme = (contentArea: ContentArea | undefined): Theme => {
  if (contentArea === undefined) {
    return theme
  }

  const { primaryColor, learningColor, trainingColor } = contentArea
  const colors = { ...theme.colors }

  if (primaryColor !== undefined) {
    colors.backgroundHeader = primaryColor
    colors.textOnHeader = getReadableTextColor(primaryColor, theme.colors.textOnHeader)
  }
  if (learningColor !== undefined) {
    colors.backgroundLearning = learningColor
    colors.textOnLearningCard = getReadableTextColor(learningColor, theme.colors.textOnLearningCard)
    colors.textOnLearningItem = colors.textOnLearningCard
  }
  if (trainingColor !== undefined) {
    colors.backgroundTraining = trainingColor
    colors.textOnTrainingCard = getReadableTextColor(trainingColor, theme.colors.textOnTrainingCard)
    colors.textOnTrainingItem = colors.textOnTrainingCard
  }

  return { ...theme, colors }
}

export default getAreaTheme
