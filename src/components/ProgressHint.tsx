import React, { ReactElement, useState } from 'react'
import styled from 'styled-components/native'

import { BasicLightBulbIcon } from '../../assets/images'
import { StandardJobId } from '../models/Job'
import { getLabels } from '../services/helpers'
import FeedbackModal from './FeedbackModal'
import Modal from './Modal'

const Container = styled.View`
  border-radius: 2px;
  border: 1px solid ${props => props.theme.colors.backgroundLightGrey};
  background: ${props => props.theme.colors.backgroundLightBlue};
  margin-bottom: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm};
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const StyledText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  line-height: 24;
`

const StyledFakeButton = styled.Text`
  margin-left: ${props => props.theme.spacings.md};
  color: ${props => props.theme.colors.link};
`

type ProgressHintProps = {
  jobId: StandardJobId
}

const ProgressHint = ({ jobId }: ProgressHintProps): ReactElement => {
  const [showHint, setShowHint] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  return (
    <Container>
      <BasicLightBulbIcon width={32} height={32} />
      <StyledText>
        {getLabels().exercises.progressLost.notShown}
        {'  '}
        <StyledFakeButton onPress={() => setShowHint(true)} accessibilityRole='button'>
          {getLabels().exercises.progressLost.moreInfo}
        </StyledFakeButton>
      </StyledText>
      <Modal
        text={getLabels().exercises.progressLost.explanation}
        visible={showHint}
        onClose={() => setShowHint(false)}
        confirmationButtonText={getLabels().exercises.progressLost.contactUs}
        confirmationAction={() => {
          setShowHint(false)
          setShowFeedbackModal(true)
        }}
      />
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackTarget={{ type: 'job', jobId }}
      />
    </Container>
  )
}

export default ProgressHint
