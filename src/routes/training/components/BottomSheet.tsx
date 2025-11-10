import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Modal } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import theme from '../../../constants/theme'

const ModalContainer = styled(Animated.View)`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`

const ModalBody = styled(Animated.View)<{ bottomPadding: number }>`
  background-color: ${props => props.theme.colors.backgroundHigh};
  padding-bottom: ${props => props.bottomPadding}px;
  padding-top: ${props => props.theme.spacings.md};
  border-radius: ${props => props.theme.spacings.md};
`

export type BottomSheetProps = {
  visible: boolean
  children: ReactElement | ReactElement[]
}

const BottomSheet = ({ visible, children }: BottomSheetProps): ReactElement => {
  const insets = useSafeAreaInsets()
  // Due to animations, this is visible for a bit longer than indicated by the `visible` prop.
  const [shouldBeVisible, setShouldBeVisible] = useState(true)

  const slideInAnimation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (visible) {
      setShouldBeVisible(false)
      Animated.timing(slideInAnimation, {
        toValue: 1,
        duration: theme.animations.durationMs,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideInAnimation, {
        toValue: 0,
        duration: theme.animations.durationMs,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShouldBeVisible(true))
    }
  }, [slideInAnimation, visible])

  const trimColor = slideInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.6)'],
  })
  const offset = slideInAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [hp('100%'), 0],
  })

  return (
    <Modal visible={!shouldBeVisible} transparent animationType='none' statusBarTranslucent navigationBarTranslucent>
      <ModalContainer style={{ backgroundColor: trimColor }}>
        <ModalBody bottomPadding={insets.bottom} style={{ transform: [{ translateY: offset }] }}>
          {children}
        </ModalBody>
      </ModalContainer>
    </Modal>
  )
}

export default BottomSheet
