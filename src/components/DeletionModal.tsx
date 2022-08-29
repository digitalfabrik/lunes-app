import React from 'react'
import styled from 'styled-components/native'

import { getLabels } from '../services/helpers'
import Modal from './Modal'
import { ContentSecondary } from './text/Content'

interface PropsType {
  isVisible: boolean
  onConfirm: () => void
  onClose: () => void
}

const Explanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.lg} ${props => props.theme.spacings.xl};
  text-align: center;
`

const DeletionModal = ({ isVisible, onConfirm, onClose }: PropsType): JSX.Element => (
  <Modal
    visible={isVisible}
    onClose={onClose}
    text={getLabels().manageSelection.deleteModal.confirmationQuestion}
    confirmationButtonText={getLabels().manageSelection.deleteModal.confirm}
    confirmationAction={onConfirm}>
    <Explanation>{getLabels().manageSelection.deleteModal.explanation}</Explanation>
  </Modal>
)

export default DeletionModal
