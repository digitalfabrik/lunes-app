import React, { ReactElement, useState, useCallback } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'
// import { useFocusEffect } from '@react-navigation/native'
import { ThumbsDownIcon } from '../../assets/images'
import { ContentSecondaryLight } from './text/Content'
import { getLabels} from '../services/helpers'
// import { reportError } from '../services/sentry'
// import { getFeedback } from '../hooks/helpers'

const BadgeContainer = styled.View`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    background-color: ${props => props.theme.colors.networkErrorBackground};
    width: 100%;
`
import Trophy from '../../components/Trophy'

const BadgeText = styled(ContentSecondaryLight)`
    font-style: italic;
    margin-left: ${props => props.theme.spacings.xs};
`

interface FeedbackBadgeProps {
  disciplineId: number
  thisLevel: number
  nextLevel: number | null
}

const FeedbackModal = (props: FeedbackBadgeProps | null): ReactElement => (
    // const [feedback, setFeedback] = useState<number>(0)
  //
  //   const {disciplineId, thisLevel, nextLevel} = props ?? {}
  //
  //   useFocusEffect(
  //   useCallback(() => {
  //       if (disciplineId && nextLevel) {
  //     getFeedback(disciplineId, nextLevel)
  //       .then(setFeedback)
  //       .catch(reportError)
  //           }
  //   }, [disciplineId, nextLevel])
  // )
    // if (!nextLevel || thisLevel !== nextLevel) { return null }

    <BadgeContainer>
        <ThumbsDownIcon width={wp('7%')} height={wp('7%')} />
        <BadgeText>{getLabels().exercises.feedback.negative}</BadgeText>
    </BadgeContainer>
    )

export default FeedbackModal
