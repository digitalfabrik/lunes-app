import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { GenericListItemContainer } from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import { ContentSecondaryLight } from '../../../components/text/Content'
import labels from '../../../constants/labels.json'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DisciplineCard from './DisciplineCard'

const Placeholder = styled(GenericListItemContainer)`
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

const CustomDiscipline = ({ apiKey, navigation }: CustomDisciplineItemProps): JSX.Element => {
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
        {/* TODO adjust height of Placeholder */}
        <LoadingSpinner>
          <Loading isLoading />
        </LoadingSpinner>
      </Placeholder>
    )
  }
  return (
    <>
      {data ? (
        <DisciplineCard discipline={data} showProgress={false} onPress={navigate} navigateToNextExercise={navigate} />
      ) : (
        <Placeholder>
          <ContentSecondaryLight>
            {labels.home.errorLoadCustomDiscipline} {apiKey}
          </ContentSecondaryLight>
        </Placeholder>
      )}
    </>
  )
}

export default CustomDiscipline
