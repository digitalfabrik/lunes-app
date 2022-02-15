import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'

const Container = styled(Pressable)<{ pressed: boolean }>`
  min-height: ${wp('22%')}px;
  margin: 0px 16px 8px 16px;
  padding: 12px 8px 12px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.pressed ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border: 1px solid ${prop => (prop.pressed ? prop.theme.colors.lunesBlack : prop.theme.colors.lunesBlackUltralight)};
  border-radius: 2px;
`
const Title = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.pressed ? props.theme.colors.white : props.theme.colors.lunesGreyDark)};
`

const Icon = styled.Image`
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const IconContainer = styled.View`
  justify-content: center;
  margin-right: 10px;
`

const TextContainer = styled.View`
  flex: 1;
`

const DescriptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Description = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.pressed ? props.theme.colors.lunesWhite : props.theme.colors.lunesGreyMedium)};
`

const BadgeLabel = styled.Text<{ pressed: boolean }>`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  min-width: ${wp('6%')}px;
  height: ${wp('4%')}px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  color: ${prop => (prop.pressed ? prop.theme.colors.lunesGreyMedium : prop.theme.colors.lunesWhite)};
  background-color: ${prop => (prop.pressed ? prop.theme.colors.lunesWhite : prop.theme.colors.lunesGreyMedium)};
  font-size: ${prop => prop.theme.fonts.smallFontSize};
  margin-right: 5px;
`

const PRESS_ANIMATION_DURATION = 300

interface DisciplineItemProps {
  title: string
  icon: string | ReactElement
  description: string
  badgeLabel?: string
  onPress: () => void
}

const DisciplineItem = ({ onPress, icon, title, description, badgeLabel }: DisciplineItemProps): ReactElement => {
  const [pressed, setPressed] = useState<boolean>(false)
  const onItemPress = () => {
    setPressed(true)
    setTimeout(() => setPressed(false), PRESS_ANIMATION_DURATION)
    onPress()
  }

  return (
    <Container onPress={onItemPress} pressed={pressed}>
      <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>
      <TextContainer>
        <Title pressed={pressed} numberOfLines={3}>
          {title}
        </Title>
        <DescriptionContainer>
          {badgeLabel && <BadgeLabel pressed={pressed}>{badgeLabel}</BadgeLabel>}
          <Description pressed={pressed}>{description}</Description>
        </DescriptionContainer>
      </TextContainer>
      <ChevronRight fill={pressed ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </Container>
  )
}

export default DisciplineItem
