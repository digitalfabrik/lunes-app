import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { Discipline } from '../constants/endpoints'

const Container = styled(Pressable)<{ selected: boolean }>`
  min-height: ${wp('22%')}px;
  margin: 0px 16px 8px 16px;
  padding: 12px 8px 12px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.selected ? prop.theme.colors.primary : prop.theme.colors.white)};
  border: 1px solid ${prop => (prop.selected ? prop.theme.colors.primary : prop.theme.colors.disabled)};
  border-radius: 2px;
`
const Title = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.textColor)};
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

export interface DisciplineItemProps {
  item: Discipline
  children: ReactElement
  selected: boolean
  onPress: () => void
}

const DisciplineItem = ({ selected, onPress, item, children }: DisciplineItemProps): JSX.Element => {
  const { icon, title } = item
  const theme = useTheme()
  return (
    <Container onPress={onPress} selected={selected}>
      <Icon source={{ uri: icon }} />
      <TextContainer>
        <Title selected={selected} numberOfLines={3}>
          {title}
        </Title>
        {children}
      </TextContainer>
      <ChevronRight fill={selected ? theme.colors.secondarySelectedColor : theme.colors.primary} testID='arrow' />
    </Container>
  )
}

export default DisciplineItem
