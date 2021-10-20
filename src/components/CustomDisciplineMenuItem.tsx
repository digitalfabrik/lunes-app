import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Arrow } from '../../assets/images'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import Loading from './Loading'
import MenuItem from './MenuItem'

const LoadingPlaceholder = styled.View`
  height: ${wp('22%')}px;
  background-color: ${props => props.theme.colors.white};
  margin: 0px 16px 8px 16px;
  border: 1px solid ${prop => prop.theme.colors.lunesBlackUltralight};
  border-radius: 2px;
`

const LoadingSpinner = styled.View`
  padding-top: ${wp('10%')}px;
`

const Description = styled.Text<{ selected: boolean }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => (props.selected ? props.theme.colors.white : props.theme.colors.lunesGreyMedium)};
`

interface CustomDisciplineMenuItemPropsType {
  apiKey: string
  selectedId: number | null
  setSelectedId: (input: number) => void
  navigation: StackNavigationProp<RoutesParamsType, 'Home'>
}

const CustomDisciplineMenuItem = ({
  apiKey,
  selectedId,
  setSelectedId,
  navigation
}: CustomDisciplineMenuItemPropsType): JSX.Element => {
  const { data } = useLoadGroupInfo(apiKey)

  return !data ? (
    <LoadingPlaceholder>
      <LoadingSpinner>
        <Loading isLoading={true}></Loading>
      </LoadingSpinner>
    </LoadingPlaceholder>
  ) : (
    <MenuItem
      selected={data.id === selectedId}
      onPress={() => {
        setSelectedId(data.id)
        navigation.navigate('DisciplineSelection', {
          extraParams: {
            discipline: data,
            apiKeyOfCustomDiscipline: apiKey
          }
        })
      }}
      icon={data.icon}
      title={data.title}>
      <Description selected={data.id === selectedId}>
        {data.numberOfChildren} {data.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
      </Description>
    </MenuItem>
    // TODO show error
  )
}

export default CustomDisciplineMenuItem
