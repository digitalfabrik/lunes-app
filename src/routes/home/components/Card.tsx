import React, { ReactElement, ReactNode } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ArrowLeftIcon, ArrowRightIcon } from '../../../../assets/images'
import PressableOpacity from '../../../components/PressableOpacity'
import { Heading } from '../../../components/text/Heading'

const Icon = styled.Image`
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

const Box = styled.Pressable<{ width?: number }>`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
  display: flex;
  justify-content: space-between;
  margin: ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
  min-height: ${hp('28%')}px;
  ${props => props.width && `width: ${props.width}px;`}
`

const BoxHeading = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: ${props => props.theme.spacings.sm};
  gap: ${props => props.theme.spacings.sm};
`

const HeadingContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacings.sm};
`

const Title = styled(Heading)`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  flex-shrink: 1;
  text-align: center;
`

type CardProps = {
  heading?: string
  icon?: string | ReactElement
  onPress?: () => void
  onPressLeft?: () => void
  onPressLeftAccessibilityLabel?: string
  onPressRight?: () => void
  onPressRightAccessibilityLabel?: string
  width?: number
  children: ReactNode
}

const Card = (props: CardProps): ReactElement => {
  const {
    heading,
    icon,
    onPress,
    onPressLeft,
    onPressLeftAccessibilityLabel,
    onPressRight,
    onPressRightAccessibilityLabel,
    width,
    children,
  } = props
  return (
    <Box onPress={onPress} width={width}>
      {(!!icon || !!heading) && (
        <BoxHeading>
          {onPressLeft !== undefined && (
            <PressableOpacity
              onPress={onPressLeft}
              testID='navigate-left'
              accessibilityLabel={onPressLeftAccessibilityLabel}
            >
              <ArrowLeftIcon />
            </PressableOpacity>
          )}
          <HeadingContent>
            {!!icon && (typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon)}
            {!!heading && <Title>{heading}</Title>}
          </HeadingContent>
          {onPressRight !== undefined && (
            <PressableOpacity
              onPress={onPressRight}
              testID='navigate-right'
              accessibilityLabel={onPressRightAccessibilityLabel}
            >
              <ArrowRightIcon />
            </PressableOpacity>
          )}
        </BoxHeading>
      )}
      {children}
    </Box>
  )
}

export default Card
