import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Arrow } from '../../assets/images'
import { COLORS } from '../constants/theme/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

const Container = styled(Pressable)<{ selected: boolean }>`
  margin: 0px 16px 8px 16px;
  justify-content: space-between;
  padding: 17px 8px 17px 16px;
  flex-direction: row;
  align-items: center;
  margin-left: ${prop => (prop.selected ? wp('5%') : 16)}px;
  margin-right: ${prop => (prop.selected ? wp('5%') : 16)}px;
  background-color: ${prop => (prop.selected ? prop.theme.colors.lunesBlack : prop.theme.colors.white)};
  border-color: ${prop => prop.theme.colors.lunesWhite};
  border-width: ${prop => (!prop.selected ? 1 : 0)}px;
  border-style: solid;
  border-radius: ${prop => (!prop.selected ? 2 : 0)}px;
`
const Title = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: 0.11px;
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

const MenuItem = ({ selected, onPress, icon, title, children }: IMenuItemProps): JSX.Element => {
  return (
    <Container onPress={onPress} selected={selected}>
      <Left>
        <Icon source={{ uri: icon }} />
        <View>
          <Title selected={selected} testID='title'>
            {title}
          </Title>
          {children}
        </View>
      </Left>
      <Arrow fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack} testID='arrow' />
    </Container>
  )
}
export default MenuItem
