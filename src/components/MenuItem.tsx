import React, { ReactElement } from 'react'
import { View, Pressable } from 'react-native'
import { Arrow } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

const ItemStyle = styled(Pressable)`
  justify-content: space-between;
  padding: 17px 8px 17px 16px;
  margin: 0px 16px 8px 16px;
  flex-direction: row;
  align-items: center;
  margin-left: ${(prop: IMenuItemProps) => (prop.selected ? wp('5%') : 16)}px;
  margin-right: ${(prop: IMenuItemProps) => (prop.selected ? wp('5%') : 16)}px;
  background-color: ${(prop: IMenuItemProps) => (prop.selected ? COLORS.lunesBlack : COLORS.white)};
  border-color: ${COLORS.white};
  border-width: ${(prop: IMenuItemProps) => (!prop.selected ? 1 : 0)}px;
  border-style: solid;
  border-radius: ${(prop: IMenuItemProps) => (!prop.selected ? 2 : 0)}px;
`
const ItemTitleStyle = styled.Text`
  font-size: ${wp('5%')}px;
  font-weight: 600;
  letter-spacing: 0.11px;
  margin-bottom: 2px;
  font-family: 'SourceSansPro-SemiBold';
  color: ${(prop: IMenuItemProps) => (prop.selected ? COLORS.white : COLORS.lunesGreyDark)};
`
const Icon = styled.Image`
  justify-content: center;
  margin-right: 10px;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`
const Left = styled.View`
  flex-direction: row;
  align-items: center;
`

export interface IMenuItemProps {
  selected: boolean
  onPress?: () => void
  icon?: string
  title?: string
  children: ReactElement[] | string | undefined
}

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps): JSX.Element => {
  return (
    <ItemStyle onPress={onPress} selected={selected}>
      <Left>
        <Icon source={{ uri: icon }} />
        <View>
          <ItemTitleStyle selected={selected} testID='title'>
            {title}
          </ItemTitleStyle>
          {children}
        </View>
      </Left>
      <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </ItemStyle>
  )
}
export default MenuItem
