import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AddIconWhite, BookIcon } from '../../assets/images'
import Button from '../components/Button'
import ListItem from '../components/ListItem'
import RouteWrapper from '../components/RouteWrapper'
import Title from '../components/Title'
import { BUTTONS_THEME } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'

const Root = styled.View`
  padding: ${props => props.theme.spacings.md};
  height: 100%;
`

const ButtonContainer = styled.View`
  padding-bottom: ${props => props.theme.spacings.sm};
  position: absolute;
  align-self: center;
  bottom: 0px;
`

type UserVocabularyOverviewScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'UserVocabularyOverview'>
}

const UserVocabularyOverviewScreen = ({ navigation }: UserVocabularyOverviewScreenProps): ReactElement => {
  const { title, description, list, listDescription, create, practice, practiceDescription } =
    getLabels().userVocabulary.overview
  const theme = useTheme()

  return (
    <RouteWrapper>
      <Root>
        <Title title={title} description={description} />
        <ListItem
          icon={<BookIcon color={theme.colors.black} />}
          title={list}
          description={listDescription}
          onPress={() => navigation.navigate('UserVocabularyList')}
        />
        <ListItem
          icon={<BookIcon color={theme.colors.black} />}
          title={practice}
          description={practiceDescription}
          onPress={() => navigation.navigate('UserVocabularyUnitSelection')}
        />
        <ButtonContainer>
          <Button
            onPress={() => navigation.navigate('UserVocabularyProcess', {})}
            label={create}
            buttonTheme={BUTTONS_THEME.contained}
            iconRight={AddIconWhite}
          />
        </ButtonContainer>
      </Root>
    </RouteWrapper>
  )
}

export default UserVocabularyOverviewScreen
