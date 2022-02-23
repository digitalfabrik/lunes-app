import React, { ReactElement, useState } from 'react'
import { Pressable } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ChevronRight } from '../../assets/images'

const Container = styled(Pressable)<{ pressed: boolean }>`
  min-height: ${hp('12%')}px;
  margin: ${props => `0 ${props.theme.spacings.sm} ${props.theme.spacings.xxs} ${props.theme.spacings.sm}`};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.pressed ? prop.theme.colors.primary : prop.theme.colors.backgroundAccent)};
  border: 1px solid ${prop => (prop.pressed ? prop.theme.colors.primary : prop.theme.colors.disabled)};
  border-radius: 2px;
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
  const theme = useTheme()

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
      <ChevronRight
        fill={pressed ? theme.colors.buttonSelectedSecondary : theme.colors.primary}
        testID='arrow'
        width={wp('6%')}
        height={hp('6%')}
      />
    </Container>
  )
}

export default DisciplineItem
