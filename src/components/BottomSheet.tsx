import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Modal } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import theme from '../constants/theme'
import { Color } from '../constants/theme/colors'

const ModalContainer = styled(Animated.View)`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`

const ModalBody = styled(Animated.View)<{ bottomPadding: number; backgroundColor: Color }>`
  background-color: ${props => props.backgroundColor};
  padding-bottom: ${props => props.bottomPadding}px;
  padding-top: ${props => props.theme.spacings.md};
  border-top-left-radius: ${props => props.theme.spacings.md};
  border-top-right-radius: ${props => props.theme.spacings.md};
  overflow: hidden;
`

/**
 * Returns the passed props if the component should render, otherwise it retains the last rendered props
 */
const useExitProps = <T,>(props: T, shouldRender: boolean): T => {
  const prevPropsRef = useRef(props)
  if (shouldRender) {
    prevPropsRef.current = props
  }
  return prevPropsRef.current
}

export type BottomSheetProps = {
  visible: boolean
  backgroundColor?: Color
  children: ReactElement | ReactElement[]
}

const BottomSheet = ({ visible, ...props }: BottomSheetProps): ReactElement => {
  // Make sure to not render the new state when displaying the exit animation
  const { children, backgroundColor } = useExitProps(props, visible)
  // Due to animations, this is visible for a bit longer than indicated by the `visible` prop.
  const [shouldBeVisible, setShouldBeVisible] = useState(false)
  // For some reason, `useSafeAreaInsets()` always returns 0 here
  const bottomPadding = initialWindowMetrics?.insets.bottom ?? 0

  const slideInAnimation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (visible) {
      setShouldBeVisible(true)
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
      }).start(() => setShouldBeVisible(false))
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
    <Modal visible={shouldBeVisible} transparent animationType='none' statusBarTranslucent navigationBarTranslucent>
      <ModalContainer style={{ backgroundColor: trimColor }}>
        <ModalBody
          backgroundColor={backgroundColor ?? theme.colors.backgroundHigh}
          bottomPadding={bottomPadding}
          style={{ transform: [{ translateY: offset }, { perspective: 1000 }] }}>
          {children}
        </ModalBody>
      </ModalContainer>
    </Modal>
  )
}

export default BottomSheet
