import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Arrow } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'

const Container = styled(Pressable)`
  margin: 0px 16px 8px 16px;
  padding: 17px 8px 17px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(prop: MenuItemStyleProps) => (prop.selected ? COLORS.lunesBlack : COLORS.white)};
  border: 1px solid ${(prop: MenuItemStyleProps) => (prop.selected ? COLORS.lunesBlack : COLORS.lunesBlackUltralight)};
  border-radius: 2px;
`
const Title = styled.Text`
  font-size: ${wp('5%')}px;
  letter-spacing: 0.11px;
  margin-bottom: 2px;
  font-family: 'SourceSansPro-SemiBold';
  color: ${(prop: MenuItemStyleProps) => (prop.selected ? COLORS.white : COLORS.lunesGreyDark)};
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

interface MenuItemStyleProps {
  selected: boolean
}

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
        <Title selected={selected} testID='title' numberOfLines={3}>
          {title}
        </Title>
        {children}
      </TextContainer>
      <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </Container>
  )
}
export default MenuItem
