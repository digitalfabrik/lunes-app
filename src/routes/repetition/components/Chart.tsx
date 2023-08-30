import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { LineSegment, VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from 'victory-native'

import theme from '../../../constants/theme'
import useLoadAsync from '../../../hooks/useLoadAsync'
import { getNumberOfWordsInEachSection, sections } from '../../../services/RepetitionService'
import { getLabels } from '../../../services/helpers'

const { chartColor1, chartColor2, chartColor3, chartColor4 } = theme.colors
const barColors = [chartColor1, chartColor2, chartColor2, chartColor2, chartColor2, chartColor2, chartColor3]
const Chart: () => ReactElement = () => {
  const { new_, learned, sectionOneToFive } = getLabels().repetition.chart
  const { words } = getLabels().general

  const [chartData, setChartData] = useState<{ y: number; x: number; fill: string }[]>(
    Array(sections.length).fill({
      y: 0,
      fill: chartColor2,
    })
  )

  const { data, refresh } = useLoadAsync(getNumberOfWordsInEachSection, undefined)

  useEffect(() => {
    if (data) {
      setChartData(data.map((item, index) => ({ y: item, x: index, fill: barColors[index] })))
    }
  }, [data])

  useFocusEffect(useCallback(() => refresh(), [refresh]))

  return (
    <VictoryChart height={hp('35%')}>
      <VictoryAxis
        crossAxis
        offsetY={40}
        tickValues={sections}
        tickFormat={[[new_, words], '', '', sectionOneToFive, '', '', [learned, words]]}
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

export default Chart
