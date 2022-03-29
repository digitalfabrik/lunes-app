import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import styled from 'styled-components/native'

import Button from '../../components/Button'
import DisciplineListItem from '../../components/DisciplineListItem'
import Header from '../../components/Header'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentSecondary } from '../../components/text/Content'
import { BUTTONS_THEME } from '../../constants/data'
import { Discipline } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'

const Root = styled.ScrollView`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
`

const ButtonContainer = styled.View`
  margin: ${props => props.theme.spacings.md} auto;
`

const StyledText = styled(ContentSecondary)`
  margin-top: ${props => props.theme.spacings.xxl};
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.lg};
`

interface IntroScreenProps {
  navigation: StackNavigationProp<RoutesParams, 'Intro'>
}

const IntroScreen = ({ navigation }: IntroScreenProps): JSX.Element => {
  const { data: disciplines, error, loading, refresh } = useLoadDisciplines(null)
  const { data: selectedProfessions, refresh: refreshSelectedProfessions } = useReadSelectedProfessions()

  useFocusEffect(
    React.useCallback(() => {
      refreshSelectedProfessions()
    }, [refreshSelectedProfessions])
  )

  const navigateToDiscipline = (item: Discipline): void => {
    navigation.navigate('ProfessionSelection', {
      discipline: item
    })
  }

  const navigateToHomeScreen = (): void => {
    navigation.navigate('Home')
  }

  const disciplineItems = disciplines?.map(item => (
    <DisciplineListItem key={item.id} item={item} onPress={() => navigateToDiscipline(item)} hasBadge={false} />
  ))

  return (
    <Root>
      <Header />
      <StyledText>{labels.intro.welcome}</StyledText>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {disciplineItems}
      </ServerResponseHandler>
      <ButtonContainer>
        <Button
          onPress={navigateToHomeScreen}
          label={
            selectedProfessions && selectedProfessions.length > 0
              ? labels.intro.confirmSelection
              : labels.intro.skipSelection
          }
          buttonTheme={BUTTONS_THEME.contained}
        />
      </ButtonContainer>
    </Root>
  )
}

export default IntroScreen
