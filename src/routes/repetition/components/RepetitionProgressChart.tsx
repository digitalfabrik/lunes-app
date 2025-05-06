import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { LineSegment, VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from 'victory-native'

import theme from '../../../constants/theme'
import useRepetitionService from '../../../hooks/useRepetitionService'
import { sections } from '../../../services/RepetitionService'
import { getLabels } from '../../../services/helpers'

const { chartColor1, chartColor2, chartColor3, chartColor4 } = theme.colors
const barColors = [chartColor1, chartColor2, chartColor2, chartColor2, chartColor2, chartColor2, chartColor3]

const RepetitionProgressChart: () => ReactElement = () => {
  const { untrained, learned, sectionOneToFive } = getLabels().repetition.chart
  const { words } = getLabels().general

  const repetitionService = useRepetitionService()
  const numberOfWordsInEachSection = repetitionService.getNumberOfWordsInEachSection()
  const chartData = numberOfWordsInEachSection.map((item, index) => ({ y: item, x: index, fill: barColors[index] }))

  return (
    <VictoryChart height={hp('35%')}>
      <VictoryAxis
        crossAxis
        offsetY={40}
        tickValues={sections}
        tickFormat={[[untrained, words], '', '', sectionOneToFive, '', '', [learned, words]]}
        axisComponent={
          <LineSegment
            style={{
              stroke: chartColor4,
              strokeWidth: 3,
              strokeDasharray: [0, '12%', '90%'],
              transform: 'scale(0.9 1)',
            }}
          />
        }
      />
      <VictoryBar
        animate={{
          animationWhitelist: ['data', 'style'],
        }}
        labels={({ datum }) => String(Math.round(datum.y))} // Round is needed to avoid floats during animation
        labelComponent={<VictoryLabel />}
        data={chartData}
        barRatio={1}
        style={{
          data: { fill: ({ datum }) => datum.fill },
        }}
      />
    </VictoryChart>
  )
}

export default RepetitionProgressChart
