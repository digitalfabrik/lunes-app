import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import labels from '../constants/labels.json'
import { useLoadGroupInfo } from '../hooks/useLoadGroupInfo'
import { RoutesParams } from '../navigation/NavigationTypes'
import DeletionSwipeable from './DeletionSwipeable'
import DisciplineListItem from './DisciplineListItem'
import { GenericListContainer } from './ListItem'
import Loading from './Loading'
import { ContentSecondaryLight } from './text/Content'

const Placeholder = styled(GenericListContainer)`
  border: 1px solid ${prop => prop.theme.colors.disabled};
  height: ${hp('12%')}px;
`

const LoadingSpinner = styled.View`
  padding: ${props => props.theme.spacings.md};
`

interface CustomDisciplineItemProps {
  apiKey: string
  navigation: StackNavigationProp<RoutesParams, 'Home'>
  refresh: () => void
}

const CustomDisciplineItem = ({ apiKey, navigation, refresh }: CustomDisciplineItemProps): JSX.Element => {
  const { data, loading } = useLoadGroupInfo(apiKey)

  const navigate = (): void => {
    if (!data) {
      return
    }
    navigation.navigate('DisciplineSelection', {
      discipline: data
    })
  }

  if (loading) {
    return (
      <Placeholder>
        <LoadingSpinner>
          <Loading isLoading />
        </LoadingSpinner>
      </Placeholder>
    )
  }
  return (
    <DeletionSwipeable apiKey={apiKey} refresh={refresh}>
      {data ? (
        <DisciplineListItem item={data} onPress={navigate} hasBadge={false} />
      ) : (
        <Placeholder>
          <ContentSecondaryLight>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ContentSecondaryLight>
        </Placeholder>
      )}
    </DeletionSwipeable>
  )
}

export default CustomDisciplineItem
