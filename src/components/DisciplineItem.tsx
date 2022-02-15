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

const Description = styled.Text<{ pressed: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.pressed ? props.theme.colors.white : props.theme.colors.lunesGreyMedium)};
`

export interface DisciplineItemProps {
  title: string
  icon: string | ReactElement
  description?: string
  children?: ReactElement
  onPress: () => void
}

const DisciplineItem = ({ onPress, icon, title, description, children }: DisciplineItemProps): ReactElement => {
  const [pressed, setPressed] = useState<boolean>(false)
  return (
    <Container
      onPress={onPress}
      pressed={pressed}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}>
      <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>
      <TextContainer>
        <Title pressed={pressed} numberOfLines={3}>
          {title}
        </Title>
        {description && <Description pressed={pressed}>{description}</Description>}
        {children}
      </TextContainer>
      <ChevronRight fill={pressed ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </Container>
  )
}

export default DisciplineItem
