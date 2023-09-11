import React, { ReactElement, ReactNode } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import { getLabels } from '../services/helpers'
import Button from './Button'
import ModalSkeleton from './ModalSkeleton'
import { HeadingText } from './text/Heading'

const Message = styled(HeadingText)`
  width: ${wp('80%')}px;
  margin-bottom: ${props => props.theme.spacings.lg};
  padding: ${props => props.theme.spacings.xs} ${props => props.theme.spacings.sm};
  text-align: center;
`

export type ModalProps = {
  visible: boolean
  onClose: () => void
  text: string
  children?: ReactNode
  confirmationButtonText: string
  cancelButtonText?: string
  showCancelButton?: boolean
  confirmationAction: () => void
  confirmationDisabled?: boolean
  testID?: string
  icon?: string | ReactElement
}

const Modal = (props: ModalProps): JSX.Element => {
  const {
    visible,
    text,
    confirmationButtonText,
    showCancelButton = true,
    confirmationAction,
    cancelButtonText = getLabels().general.back,
    children,
    onClose,
    confirmationDisabled = false,
    testID,
    icon,
  } = props

  return (
    <ModalSkeleton visible={visible} onClose={onClose} testID={testID}>
      {icon}
      <Message>{text}</Message>
      {children}
      <Button
        label={confirmationButtonText}
        onPress={confirmationAction}
        disabled={confirmationDisabled}
        buttonTheme={BUTTONS_THEME.contained}
      />
      {showCancelButton && <Button label={cancelButtonText} onPress={onClose} buttonTheme={BUTTONS_THEME.outlined} />}
    </ModalSkeleton>
  )
}
export default Modal
