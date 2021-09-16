import React, { ReactElement } from 'react'
import { View, Pressable } from 'react-native'
import { Arrow } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

const ItemStyle = styled(Pressable)`
  margin: 0px 16px 8px 16px;
  justify-content: space-between;
  padding: 17px 8px 17px 16px;
  flex-direction: row;
  align-items: center;
  margin-left: ${(prop: IMenuItemStyleProps) => (prop.selected ? wp('5%') : 16)}px;
  margin-right: ${(prop: IMenuItemStyleProps) => (prop.selected ? wp('5%') : 16)}px;
  background-color: ${(prop: IMenuItemStyleProps) => (prop.selected ? COLORS.lunesBlack : COLORS.white)};
  border-color: ${COLORS.white};
  border-width: ${(prop: IMenuItemStyleProps) => (!prop.selected ? 1 : 0)}px;
  border-style: solid;
  border-radius: ${(prop: IMenuItemStyleProps) => (!prop.selected ? 2 : 0)}px;
`
const ItemTitle = styled.Text`
  font-size: ${wp('5%')}px;
  letter-spacing: 0.11px;
  margin-bottom: 2px;
  font-family: 'SourceSansPro-SemiBold';
  color: ${(prop: IMenuItemStyleProps) => (prop.selected ? COLORS.white : COLORS.lunesGreyDark)};
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
  onPress: () => void
  icon: string
  title: string
  children: ReactElement
}
interface IMenuItemStyleProps {
  selected: boolean
}

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps): JSX.Element => {
  return (
    <ItemStyle onPress={onPress} selected={selected}>
      <Left>
        <Icon source={{ uri: icon }} />
        <View>
          <ItemTitle selected={selected} testID='title'>
            {title}
          </ItemTitle>
          {children}
        </View>
      </Left>
      <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </ItemStyle>
  )
}
export default MenuItem
