import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import labels from '../constants/labels.json'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import DeletionSwipeable from './DeletionSwipeable'
import Loading from './Loading'
import MenuItem from './MenuItem'

const Placeholder = styled.View`
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

const ErrorText = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.lunesRed};
  margin: 10px;
`

interface CustomDisciplineMenuItemPropsType {
  apiKey: string
  selectedId: string | null
  setSelectedId: (selectedId: string) => void
  navigation: StackNavigationProp<RoutesParamsType, 'Home'>
  refresh: () => void
}

const CustomDisciplineMenuItem = ({
  apiKey,
  selectedId,
  setSelectedId,
  navigation,
  refresh
}: CustomDisciplineMenuItemPropsType): JSX.Element => {
  const { data, loading } = useLoadGroupInfo(apiKey)

  const idToSelectedIdString = (id: number): string => {
    return `custom-${id}`
  }

  const navigate = (): void => {
    if (!data) {
      return
    }
    setSelectedId(idToSelectedIdString(data.id))
    navigation.navigate('DisciplineSelection', {
      extraParams: { discipline: data }
    })
  }

  if (loading) {
    return (
      <Placeholder>
        <LoadingSpinner>
          <Loading isLoading={true} />
        </LoadingSpinner>
      </Placeholder>
    )
  } else {
    return (
      <DeletionSwipeable apiKey={apiKey} refresh={refresh}>
        {data ? (
          <MenuItem item={data} selected={idToSelectedIdString(data.id) === selectedId} onPress={navigate}>
            <Description selected={idToSelectedIdString(data.id) === selectedId}>
              {data.numberOfChildren} {data.numberOfChildren === 1 ? labels.home.unit : labels.home.units}
            </Description>
          </MenuItem>
        ) : (
          <Placeholder>
            <ErrorText>
              {labels.home.errorLoadCustomDiscipline} {apiKey}
            </ErrorText>
          </Placeholder>
        )}
      </DeletionSwipeable>
    )
  }
}

export default CustomDisciplineMenuItem
