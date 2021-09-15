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
    width: 100%;
    margin-left: ${(prop: IMenuItemProps) => prop.selected ? wp('5%'): 0 };
    margin-right: ${(prop: IMenuItemProps) => prop.selected ? wp('5%'): 0 };
    background-color: ${(prop: IMenuItemProps) => prop.selected? COLORS.lunesBlack : COLORS.white };
    border-color: ${(prop: IMenuItemProps) => prop.selected? COLORS.white : COLORS.lunesBlackUltralight };
    border-width:  ${(prop: IMenuItemProps) => !prop.selected ? 1: 0 };
    border-style: ${(prop: IMenuItemProps) => !prop.selected ? 'solid' : 'solid' };
    border-radius: ${(prop: IMenuItemProps) => !prop.selected ? 2: 0 };
`;
const ItemTitleStyle = styled.Text`
    font-size: ${wp('5%')};
    letter-spacing: 0.11;
    margin-bottom: 2;
    font-family: 'SourceSansPro-SemiBold';
    color: ${(prop: IMenuItemProps) => prop.selected? COLORS.white : COLORS.lunesGreyDark};
`;
const Icon = styled.Image`
    justify-content: center;
    margin-right: 10;
    width: ${wp('7%')};
    height: ${wp('7%')};
`;
const Left = styled.View`
    flex-direction: row;
    align-items: center;
`;

export interface IMenuItemProps {
  selected: boolean
  onPress: () => void
  icon: string
  title: string
  children: ReactElement
}
}

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps): JSX.Element => {
  return (
      <ItemStyle onPress={onPress} selected={selected}>
        <Left>
          <Icon source={{ uri: icon }}  />
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