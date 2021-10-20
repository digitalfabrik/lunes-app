import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Arrow } from '../../assets/images'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'

const Container = styled(Pressable)<{ selected: boolean }>`
  height: ${wp('21%')}px;
  margin: 0px 16px 8px 16px;
  padding: 17px 8px 17px 16px;
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
  justify-content: center;
  margin-right: 10px;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const TextContainer = styled.View`
  flex: 1;
`

export interface IMenuItemProps {
  selected: boolean
  onPress: () => void
  icon: string
  title: string
  children: ReactElement
}

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps): JSX.Element => {
  return (
    <Container onPress={onPress} selected={selected}>
      <Icon source={{ uri: icon }} />
      <TextContainer>
        <Title selected={selected} numberOfLines={3}>
          {title}
        </Title>
        {children}
      </TextContainer>
      <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </Container>
  )
}
export default MenuItem
