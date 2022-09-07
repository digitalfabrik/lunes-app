import React, { ReactElement, useCallback, useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'
import FeedbackBadge from './FeedbackBadge'

import { ChevronRight } from '../../assets/images'
import { ContentSecondaryLight } from './text/Content'

export const GenericListItemContainer = styled.Pressable`
  margin-bottom: ${props => props.theme.spacings.xxs};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
`
const Container = styled(GenericListItemContainer)<{ pressed: boolean; disabled: boolean }>`
  flex-direction: column;
  border: 1px solid ${prop => (prop.pressed ? prop.theme.colors.primary : prop.theme.colors.disabled)};
  border-left-color: ${props => props.theme.colors.incorrect};
  border-left-radius: 0;
  border-left-width: 6px;
`

const ContentContainer = styled.View<{ pressed: boolean; disabled: boolean }>`
  min-height: ${hp('12%')}px;
    display: flex;
    flex-direction: row;
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  background-color: ${prop => {
    if (prop.disabled) {
      return prop.theme.colors.disabled
    }
    return prop.pressed ? prop.theme.colors.primary : prop.theme.colors.backgroundAccent
  }};
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
const PRESS_MAX_DRAG_Y = 5

interface ListItemProps {
  title: string | ReactElement
  icon?: string | ReactElement
  description?: string
  badgeLabel?: string
  children?: ReactElement
  onPress?: () => void
  rightChildren?: ReactElement
  hideRightChildren?: boolean
  arrowDisabled?: boolean
  disabled?: boolean
  feedbackInfo?: {disciplineId: number, thisLevel: number, nextLevel: number | null} | null
}

const ListItem = ({
  onPress,
  icon,
  title,
  description,
  badgeLabel,
  children,
  rightChildren,
  hideRightChildren = false,
  arrowDisabled = false,
  disabled = false,
  feedbackInfo = null,
}: ListItemProps): ReactElement => {
  const [pressInY, setPressInY] = useState<number | null>(null)
  const [pressed, setPressed] = useState<boolean>(false)
  const updatePressed = useCallback((pressed: boolean): void => onPress && setPressed(pressed), [onPress])

  const theme = useTheme()

  const onPressIn = (e: GestureResponderEvent) => {
    setPressInY(e.nativeEvent.pageY)
  }

  const onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (pressInY && Math.abs(pressInY - e.nativeEvent.pageY) <= PRESS_MAX_DRAG_Y) {
        // Only call onPress if user not scrolling
        updatePressed(true)
        if (onPress) {
          onPress()
        }
        setTimeout(() => updatePressed(false), PRESS_ANIMATION_DURATION)
      } else {
        updatePressed(false)
      }
      setPressInY(null)
    },
    [pressInY, updatePressed, onPress]
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
  const arrowColor = arrowDisabled ? theme.colors.disabled : theme.colors.primary
  const rightChildrenToRender =
    rightChildren ??
    (!hideRightChildren && (
      <ChevronRight
        fill={pressed ? theme.colors.buttonSelectedSecondary : arrowColor}
        testID='arrow'
        width={wp('6%')}
        height={hp('6%')}
      />
    ))

  return (
    <Container
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={() => updatePressed(true)}
      pressed={pressed}
      delayLongPress={200}
      testID='list-item'>
      <FeedbackBadge feedbackInfo={feedbackInfo}/>
      <ContentContainer>
      {iconToRender}
      <FlexContainer>
        {titleToRender}
        <DescriptionContainer>
          {badgeLabel && <BadgeLabel pressed={pressed}>{badgeLabel}</BadgeLabel>}
          {description && description.length > 0 && <Description pressed={pressed}>{description}</Description>}
        </DescriptionContainer>
        {children}
      </FlexContainer>
      {rightChildrenToRender}
      </ContentContainer>
    </Container>
  )
}

export default ListItem
