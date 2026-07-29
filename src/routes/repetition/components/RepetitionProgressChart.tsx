import React, { ReactElement } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Svg, { Line, Rect, Text } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import useRepetitionService from '../../../hooks/useRepetitionService'
import { getLabels, wordsDescription } from '../../../services/helpers'

const CHART_HEIGHT_RATIO = 0.35
const VALUE_LABEL_HEIGHT = 24
const AXIS_LABEL_HEIGHT = 44
const BAR_WIDTH_RATIO = 0.6
const BAR_BASELINE_GAP = 8
const VALUE_LABEL_FONT_SIZE = 16
const AXIS_LABEL_FONT_SIZE = 12
const AXIS_LABEL_LINE_HEIGHT = 16
const SECTION_KEYS = ['untrained', 'section1', 'section2', 'section3', 'section4', 'section5', 'learned']

const RepetitionProgressChart: () => ReactElement = () => {
  const theme = useTheme()
  const { chartColor1, chartColor2, chartColor3, chartColor4, text: textColor } = theme.colors
  const barColors = [chartColor1, chartColor2, chartColor2, chartColor2, chartColor2, chartColor2, chartColor3]

  const labels = getLabels()
  const { untrained, learned, sectionOneToFive, section: sectionLabel } = labels.repetition.chart
  const words = labels.general.word.plural
  // two-word labels wrap onto a second line
  const axisLabelsBySection: Record<number, string[]> = {
    0: [untrained, words],
    3: [sectionOneToFive],
    6: [learned, words],
  }

  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const chartWidth = windowWidth - 2 * theme.spacingsPlain.md
  const chartHeight = windowHeight * CHART_HEIGHT_RATIO
  const plotHeight = chartHeight - VALUE_LABEL_HEIGHT - AXIS_LABEL_HEIGHT
  const baselineY = VALUE_LABEL_HEIGHT + plotHeight

  const repetitionService = useRepetitionService()
  const numberOfWordsInEachSection = repetitionService.getNumberOfWordsInEachSection()
  const highestSectionCount = Math.max(...numberOfWordsInEachSection, 1) // avoid dividing by zero when empty
  const slotWidth = chartWidth / numberOfWordsInEachSection.length
  const barWidth = slotWidth * BAR_WIDTH_RATIO
  const barBaselineY = baselineY - BAR_BASELINE_GAP
  const barAreaHeight = plotHeight - BAR_BASELINE_GAP

  const lastSection = numberOfWordsInEachSection.length - 1
  const sectionName = (index: number): string => {
    if (index === 0) {
      return untrained
    }
    if (index === lastSection) {
      return learned
    }
    return `${sectionLabel} ${index}`
  }

  const accessibilityLabel = numberOfWordsInEachSection
    .map((count, index) => `${sectionName(index)}: ${wordsDescription(count)}`)
    .join(', ')

  return (
    <View accessible accessibilityRole='image' accessibilityLabel={accessibilityLabel}>
      <Svg width={chartWidth} height={chartHeight}>
        <Line
          x1={slotWidth}
          y1={baselineY}
          x2={chartWidth - slotWidth}
          y2={baselineY}
          stroke={chartColor4}
          strokeWidth={3}
        />
        {numberOfWordsInEachSection.map((count, section) => {
          const barHeight = (count / highestSectionCount) * barAreaHeight
          const centerX = slotWidth * section + slotWidth / 2
          const barTop = barBaselineY - barHeight
          return (
            <React.Fragment key={SECTION_KEYS[section]}>
              <Rect
                x={centerX - barWidth / 2}
                y={barTop}
                width={barWidth}
                height={barHeight}
                fill={barColors[section]}
              />
              <Text
                x={centerX}
                y={barTop - VALUE_LABEL_FONT_SIZE / 2}
                fill={textColor}
                fontSize={VALUE_LABEL_FONT_SIZE}
                fontFamily={theme.fonts.contentFontRegular}
                textAnchor='middle'
              >
                {count}
              </Text>
              {axisLabelsBySection[section]?.map((labelLine, lineIndex) => (
                <Text
                  key={labelLine}
                  x={centerX}
                  y={baselineY + AXIS_LABEL_LINE_HEIGHT * (lineIndex + 1)}
                  fill={textColor}
                  fontSize={AXIS_LABEL_FONT_SIZE}
                  fontFamily={theme.fonts.contentFontRegular}
                  textAnchor='middle'
                >
                  {labelLine}
                </Text>
              ))}
            </React.Fragment>
          )
        })}
      </Svg>
    </View>
  )
}

export default RepetitionProgressChart
