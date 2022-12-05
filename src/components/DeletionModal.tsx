import React from 'react'
import styled from 'styled-components/native'

import { getLabels } from '../services/helpers'
import Modal from './Modal'
import { ContentSecondary } from './text/Content'

type DeletionModalProps = {
  isVisible: boolean
  onConfirm: () => void
  onClose: () => void
}

const Explanation = styled(ContentSecondary)`
  padding: 0 ${props => props.theme.spacings.lg} ${props => props.theme.spacings.xl};
  text-align: center;
`

const DeletionModal = ({ isVisible, onConfirm, onClose }: DeletionModalProps): JSX.Element => {
  const { confirmationQuestion, confirm, explanation } = getLabels().manageSelection.deleteModal
  return (
    <Modal
      visible={isVisible}
      onClose={onClose}
      text={confirmationQuestion}
      confirmationButtonText={confirm}
      confirmationAction={onConfirm}>
      <Explanation>{explanation}</Explanation>
    </Modal>
  )
}
export default DeletionModal
