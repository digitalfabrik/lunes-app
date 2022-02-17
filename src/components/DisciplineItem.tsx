import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled, { useTheme } from 'styled-components/native'

import { ChevronRight } from '../../assets/images'
import { Discipline } from '../constants/endpoints'

const Container = styled(Pressable)<{ selected: boolean }>`
  min-height: ${wp('22%')}px;
  margin: ${props => `0 ${props.theme.spacings.sm} ${props.theme.spacings.xxs} ${props.theme.spacings.sm}`};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.xs} ${props.theme.spacings.sm} ${props.theme.spacings.md}`};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${prop => (prop.selected ? prop.theme.colors.primary : prop.theme.colors.backgroundAccent)};
  border: 1px solid ${prop => (prop.selected ? prop.theme.colors.primary : prop.theme.colors.disabled)};
  border-radius: 2px;
`
const Title = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.largeFontSize};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin-bottom: 2px;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => (props.selected ? props.theme.colors.backgroundAccent : props.theme.colors.text)};
`
const Icon = styled.Image`
  justify-content: center;
  margin-right: ${props => props.theme.spacings.xs};
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
      <ChevronRight
        fill={selected ? theme.colors.buttonSelectedSecondary : theme.colors.primary}
        testID='arrow'
        width={wp('6%')}
        height={hp('6%')}
      />
    </Container>
  )
}

export default DisciplineItem
