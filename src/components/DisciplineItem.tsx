import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'

const Container = styled(Pressable)<{ selected: boolean }>`
  min-height: ${wp('22%')}px;
  margin: 0px 16px 8px 16px;
  padding: 12px 8px 12px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.selected ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border: 1px solid ${prop => (prop.selected ? prop.theme.colors.lunesBlack : prop.theme.colors.lunesBlackUltralight)};
  border-radius: 2px;
`
const Title = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyDark)};
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

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyMedium)};
`

export interface DisciplineItemProps {
  title: string
  icon: string | ReactElement
  description?: string
  children?: ReactElement
  selected: boolean
  onPress: () => void
}

const DisciplineItem = ({
  selected,
  onPress,
  icon,
  title,
  description,
  children
}: DisciplineItemProps): ReactElement => (
  <Container onPress={onPress} selected={selected}>
    <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>
    <TextContainer>
      <Title selected={selected} numberOfLines={3}>
        {title}
      </Title>
      {description && <Description selected={selected}>{description}</Description>}
      {children}
    </TextContainer>
    <ChevronRight fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
  </Container>
)

export default DisciplineItem
