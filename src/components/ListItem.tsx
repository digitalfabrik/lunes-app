import React, { ReactElement, useCallback, useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { ContentSecondaryLight } from './text/Content'

export const GenericListItemContainer = styled.Pressable`
  width: ${wp('90%')}px;
  margin-bottom: ${props => props.theme.spacings.xxs};
  align-self: center;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
`

const Container = styled(GenericListItemContainer)<{ pressed: boolean }>`
  min-height: ${hp('12%')}px;
  background-color: ${prop => (prop.pressed ? prop.theme.colors.primary : prop.theme.colors.backgroundAccent)};
  border: 1px solid ${prop => (prop.pressed ? prop.theme.colors.primary : prop.theme.colors.disabled)};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
`

const Title = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.pressed ? props.theme.colors.backgroundAccent : props.theme.colors.text)};
`

const Icon = styled.Image`
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const IconContainer = styled.View`
  justify-content: center;
  margin-right: 10px;
`

const FlexContainer = styled.View`
  flex: 1;
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Description = styled(ContentSecondaryLight)<{ pressed: boolean }>`
  color: ${props => (props.pressed ? props.theme.colors.backgroundAccent : props.theme.colors.textSecondary)};
`

const BadgeLabel = styled.Text<{ pressed: boolean }>`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${prop => (prop.pressed ? prop.theme.colors.textSecondary : prop.theme.colors.background)};
  background-color: ${prop => (prop.pressed ? prop.theme.colors.backgroundAccent : prop.theme.colors.textSecondary)};
  font-size: ${prop => prop.theme.fonts.smallFontSize};
  margin-right: ${props => props.theme.spacings.xxs};
`

const PRESS_ANIMATION_DURATION = 300
const PRESS_MAX_DRAG = 5

interface ListItemProps {
  title: string | ReactElement
  icon?: string | ReactElement
  description: string
  badgeLabel?: string
  children?: ReactElement
  onPress: () => void
  rightChildren?: ReactElement
}

const ListItem = ({
  onPress,
  icon,
  title,
  description,
  badgeLabel,
  children,
  rightChildren
}: ListItemProps): ReactElement => {
  const [pressIn, setPressIn] = useState<{ x: number; y: number } | null>(null)
  const [pressed, setPressed] = useState<boolean>(false)
  const theme = useTheme()

  const onPressIn = ({ nativeEvent }: GestureResponderEvent) => {
    setPressIn({ x: nativeEvent.pageX, y: nativeEvent.pageY })
  }

  const onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (
        pressIn &&
        Math.abs(pressIn.y - e.nativeEvent.pageY) <= PRESS_MAX_DRAG &&
        Math.abs(pressIn.x - e.nativeEvent.pageX) <= PRESS_MAX_DRAG
      ) {
        // Only call onPress if user not scrolling or swiping
        setPressed(true)
        onPress()
        setTimeout(() => setPressed(false), PRESS_ANIMATION_DURATION)
      } else {
        setPressed(false)
      }
      setPressIn(null)
    },
    [pressIn, onPress]
  )

  const titleToRender =
    typeof title === 'string' ? (
      <Title pressed={pressed} numberOfLines={3}>
        {title}
      </Title>
    ) : (
      title
    )

  const iconToRender = icon && (
    <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>
  )

  const rightChildrenToRender = rightChildren ?? (
    <ChevronRight
      fill={pressed ? theme.colors.buttonSelectedSecondary : theme.colors.primary}
      testID='arrow'
      width={wp('6%')}
      height={hp('6%')}
    />
  )

  return (
    <Container
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={() => setPressed(true)}
      pressed={pressed}
      delayLongPress={200}>
      {iconToRender}
      <FlexContainer>
        {titleToRender}
        <DescriptionContainer>
          {badgeLabel && <BadgeLabel pressed={pressed}>{badgeLabel}</BadgeLabel>}
          <Description pressed={pressed}>{description}</Description>
        </DescriptionContainer>
        {children}
      </FlexContainer>
      {rightChildrenToRender}
    </Container>
  )
}

export default ListItem
