import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect } from 'react'
import { ProgressBar } from 'react-native-paper'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import NavigationHeaderLeft from '../../../components/NavigationHeaderLeft'
import { ContentSecondary } from '../../../components/text/Content'
import theme from '../../../constants/theme'
import { Route, RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'

const ProgressText = styled(ContentSecondary)`
  margin-right: ${props => props.theme.spacings.sm};
`

type TrainingExerciseHeaderProps = {
  navigation: StackNavigationProp<RoutesParams, Route>
  currentWord: number
  numberOfWords: number
}
const TrainingExerciseHeader = ({
  currentWord,
  numberOfWords,
  navigation,
}: TrainingExerciseHeaderProps): ReactElement => {
  const progressText = `${currentWord + 1} / ${numberOfWords}`

  useEffect(() => {
    const renderHeaderLeft = () => (
      <NavigationHeaderLeft
        title={getLabels().general.header.cancelExercise}
        onPress={navigation.goBack}
        isCloseButton
      />
    )

    const renderHeaderRight = () => <ProgressText>{progressText}</ProgressText>

    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerRight: renderHeaderRight,
      headerRightContainerStyle: {
        paddingHorizontal: theme.spacingsPlain.xs,
        maxWidth: wp('25%'),
      },
    })
  }, [navigation, progressText])

  return (
    <ProgressBar
      animatedValue={numberOfWords > 0 ? currentWord / numberOfWords : 0}
      color={theme.colors.progressIndicatorTraining}
    />
  )
}

export default TrainingExerciseHeader
